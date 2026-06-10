import type { ButtonConfig } from 'meta-bind-core/src/config/ButtonConfig';
import type { ObsMetaBind } from 'meta-bind-obsidian/src/ObsMB';
import {
	getListSettingGroup,
	getValidationMessage,
	updateListItems,
} from 'meta-bind-obsidian/src/settings/ListSettingGroup';
import type { MetaBindSettingKey } from 'meta-bind-obsidian/src/settings/SettingsTypes';
import type { Setting, SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import { Notice, stringifyYaml } from 'obsidian';

export class ButtonTemplateSettings {
	constructor(
		private readonly mb: ObsMetaBind,
		private readonly onUpdate: () => void,
	) {}

	getDisplayValue(): string {
		const count = this.mb.getSettings().buttonTemplates.length;
		return `${count} template${count === 1 ? '' : 's'}`;
	}

	getStatus(): 'warning' | null {
		const templates = this.mb.getSettings().buttonTemplates;
		return templates.some((template, index) => this.getButtonTemplateWarning(template, index, templates) !== null)
			? 'warning'
			: null;
	}

	getDefinitions(): SettingDefinitionItem<MetaBindSettingKey>[] {
		const templates = this.mb.getSettings().buttonTemplates;

		return [
			getListSettingGroup(this.mb, {
				heading: 'Templates',
				emptyState: 'No button templates configured.',
				items: templates,
				addItems: {
					type: 'multiple',
					label: 'Add',
					options: [
						{
							label: 'Create new template',
							action: (): void => {
								this.mb.internal.openButtonBuilderModal({
									submitText: 'Add',
									config: this.createDefaultButtonTemplate(),
									onOkay: newTemplate => {
										updateListItems(
											this.mb.getSettings().buttonTemplates,
											templates => {
												templates.push(newTemplate);
											},
											templates => this.applyButtonTemplates(templates),
											this.onUpdate,
										);
									},
								});
							},
						},
						{
							label: 'From clipboard',
							action: (): void => {
								void this.addButtonTemplateFromClipboard();
							},
						},
					],
				},
				renderItem: (template, index) => this.getButtonTemplateSetting(template, index),
				applyItems: templates => this.applyButtonTemplates(templates),
				onUpdate: this.onUpdate,
			}),
		];
	}

	private getButtonTemplateSetting(template: ButtonConfig, index: number): SettingGroupItem<MetaBindSettingKey> {
		const actionCount = template.actions?.length ?? (template.action ? 1 : 0);
		const warning = this.getButtonTemplateWarning(template, index, this.mb.getSettings().buttonTemplates);

		return {
			name: template.id ?? template.label ?? `Button template ${index + 1}`,
			desc: warning ?? `${template.label ?? 'No label'} - ${actionCount} action${actionCount === 1 ? '' : 's'}`,
			searchable: true,
			aliases: [template.id, template.label, template.tooltip].filter(x => x !== undefined),
			render: (setting: Setting): void => {
				if (warning !== null) {
					setting.addDisplayValue(display => {
						display.setValue('Invalid').setStatus('warning');
					});
				}
				setting.addExtraButton(cb => {
					cb.setIcon('pencil');
					cb.setTooltip('Edit template');
					cb.onClick(() => {
						this.mb.internal.openButtonBuilderModal({
							submitText: 'Submit',
							config: structuredClone(template),
							onOkay: newTemplate => {
								updateListItems(
									this.mb.getSettings().buttonTemplates,
									templates => {
										templates[index] = newTemplate;
									},
									templates => this.applyButtonTemplates(templates),
									this.onUpdate,
								);
							},
						});
					});
				});
				setting.addExtraButton(cb => {
					cb.setIcon('copy');
					cb.setTooltip('Copy template YAML');
					cb.onClick(() => {
						void navigator.clipboard.writeText(stringifyYaml(template));
						new Notice('meta-bind | Copied to clipboard');
					});
				});
			},
		};
	}

	private getButtonTemplateWarning(template: ButtonConfig, index: number, templates: ButtonConfig[]): string | null {
		try {
			this.mb.buttonParser.validateConfig(template);
		} catch (error) {
			return getValidationMessage(error, 'This button template is invalid.');
		}

		if (template.id === undefined || template.id === '') {
			return 'Button templates must have an ID.';
		}
		if (templates.some((other, otherIndex) => otherIndex !== index && other.id === template.id)) {
			return `The button ID "${template.id}" is used by another template.`;
		}
		return null;
	}

	private applyButtonTemplates(templates: ButtonConfig[]): boolean {
		const previousTemplates = this.mb.getSettings().buttonTemplates;
		const errorCollection = this.mb.buttonManager.setButtonTemplates(templates);
		if (errorCollection.hasErrors()) {
			const errors = errorCollection.getErrors();
			this.mb.buttonManager.setButtonTemplates(previousTemplates);
			console.warn('meta-bind | failed to save button templates', errors);
			new Notice(
				`meta-bind | Button template could not be saved: ${errors[0]?.message ?? 'Unknown validation error.'}`,
			);
			return false;
		}

		this.mb.updateSettings(settings => {
			settings.buttonTemplates = templates;
		});

		return true;
	}

	private async addButtonTemplateFromClipboard(): Promise<void> {
		let template: ButtonConfig;
		try {
			template = this.mb.buttonParser.parseConfig(await navigator.clipboard.readText());
			if (template.id === undefined || template.id === '') {
				template.id = this.createUniqueButtonTemplateId();
			}
		} catch (e) {
			console.warn(e);
			new Notice('meta-bind | Can not parse button config. Check your button syntax.');
			return;
		}

		this.mb.internal.openButtonBuilderModal({
			submitText: 'Add',
			config: template,
			onOkay: newTemplate => {
				updateListItems(
					this.mb.getSettings().buttonTemplates,
					templates => {
						templates.push(newTemplate);
					},
					templates => this.applyButtonTemplates(templates),
					this.onUpdate,
				);
			},
		});
	}

	private createDefaultButtonTemplate(): ButtonConfig {
		return {
			...this.mb.buttonActionRunner.createDefaultButtonConfig(),
			id: this.createUniqueButtonTemplateId(),
		};
	}

	private createUniqueButtonTemplateId(): string {
		const ids = new Set(
			this.mb
				.getSettings()
				.buttonTemplates.map(template => template.id)
				.filter(x => x),
		);
		const baseId = 'button-template';
		let id = baseId;
		let counter = 2;

		while (ids.has(id)) {
			id = `${baseId}-${counter}`;
			counter += 1;
		}

		return id;
	}
}
