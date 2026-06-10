import type { InputFieldTemplate } from 'meta-bind-core/src/Settings';
import type { ObsMetaBind } from 'meta-bind-obsidian/src/ObsMB';
import { InputFieldTemplateSettingModal } from 'meta-bind-obsidian/src/settings/inputFieldTemplateSetting/InputFieldTemplateSettingModal';
import {
	getListSettingGroup,
	getValidationMessage,
	updateListItems,
} from 'meta-bind-obsidian/src/settings/ListSettingGroup';
import type { MetaBindSettingKey } from 'meta-bind-obsidian/src/settings/SettingsTypes';
import type { App, Setting, SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import { Notice } from 'obsidian';

export class InputFieldTemplateSettings {
	constructor(
		private readonly app: App,
		private readonly mb: ObsMetaBind,
		private readonly onUpdate: () => void,
	) {}

	getDisplayValue(): string {
		const count = this.mb.getSettings().inputFieldTemplates.length;
		return `${count} template${count === 1 ? '' : 's'}`;
	}

	getStatus(): 'warning' | null {
		const templates = this.mb.getSettings().inputFieldTemplates;
		return templates.some(
			(template, index) => this.getInputFieldTemplateWarning(template, index, templates) !== null,
		)
			? 'warning'
			: null;
	}

	getDefinitions(): SettingDefinitionItem<MetaBindSettingKey>[] {
		const templates = this.mb.getSettings().inputFieldTemplates;

		return [
			getListSettingGroup(this.mb, {
				heading: 'Templates',
				emptyState: 'No input field templates configured.',
				items: templates,
				addItems: {
					type: 'single',
					label: 'Add template',
					action: (): void => {
						this.openInputFieldTemplateModal(undefined, template => {
							return updateListItems(
								this.mb.getSettings().inputFieldTemplates,
								templates => {
									templates.push(template);
								},
								templates => this.applyInputFieldTemplates(templates),
								this.onUpdate,
							);
						});
					},
				},
				renderItem: (template, index) => this.getInputFieldTemplateSetting(template, index),
				applyItems: templates => this.applyInputFieldTemplates(templates),
				onUpdate: this.onUpdate,
			}),
		];
	}

	private getInputFieldTemplateSetting(
		template: InputFieldTemplate,
		index: number,
	): SettingGroupItem<MetaBindSettingKey> {
		const warning = this.getInputFieldTemplateWarning(template, index, this.mb.getSettings().inputFieldTemplates);

		return {
			name: template.name || `Input field template ${index + 1}`,
			desc: warning ?? (template.declaration || 'No declaration.'),
			searchable: true,
			aliases: [template.name, template.declaration].filter(x => x !== ''),
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
						this.openInputFieldTemplateModal(template, newTemplate => {
							return updateListItems(
								this.mb.getSettings().inputFieldTemplates,
								templates => {
									templates[index] = newTemplate;
								},
								templates => this.applyInputFieldTemplates(templates),
								this.onUpdate,
							);
						});
					});
				});
			},
		};
	}

	private getInputFieldTemplateWarning(
		template: InputFieldTemplate,
		index: number,
		templates: InputFieldTemplate[],
	): string | null {
		if (template.name === '') {
			return 'Input field templates must have a name.';
		}
		if (templates.some((other, otherIndex) => otherIndex !== index && other.name === template.name)) {
			return `The template name "${template.name}" is used by another template.`;
		}

		const errors = this.mb.inputFieldParser.validateTemplate(template).getErrors();
		if (errors.length > 0) {
			return getValidationMessage(errors[0], 'This input field template is invalid.');
		}
		return null;
	}

	private applyInputFieldTemplates(templates: InputFieldTemplate[]): boolean {
		const previousTemplates = this.mb.getSettings().inputFieldTemplates;
		const errorCollection = this.mb.inputFieldParser.parseTemplates(templates);
		if (errorCollection.hasErrors()) {
			const errors = errorCollection.getErrors();
			this.mb.inputFieldParser.parseTemplates(previousTemplates);
			console.warn('meta-bind | failed to save input field templates', errors);
			new Notice(
				`meta-bind | Input field template could not be saved: ${errors[0]?.message ?? 'Unknown validation error.'}`,
			);
			return false;
		}

		this.mb.updateSettings(settings => {
			settings.inputFieldTemplates = templates;
		});

		return true;
	}

	private openInputFieldTemplateModal(
		template: InputFieldTemplate | undefined,
		onSubmit: (template: InputFieldTemplate) => boolean | void,
	): void {
		new InputFieldTemplateSettingModal(this.app, template, onSubmit).open();
	}
}
