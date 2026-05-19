import type { InputFieldTemplate } from 'meta-bind-core/src/Settings';
import type { ObsMetaBind } from 'meta-bind-obsidian/src/ObsMB';
import { InputFieldTemplateSettingModal } from 'meta-bind-obsidian/src/settings/inputFieldTemplateSetting/InputFieldTemplateSettingModal';
import { getListSettingGroup, updateListItems } from 'meta-bind-obsidian/src/settings/ListSettingGroup';
import type { MetaBindSettingKey } from 'meta-bind-obsidian/src/settings/SettingsTypes';
import type { App, Setting, SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import { Notice } from 'obsidian';

export class InputFieldTemplateSettings {
	constructor(
		private readonly app: App,
		private readonly mb: ObsMetaBind,
		private readonly onUpdate: () => void,
	) {}

	getDefinitions(): SettingDefinitionItem<MetaBindSettingKey>[] {
		const templates = this.mb.getSettings().inputFieldTemplates;

		return [
			{
				name: 'Add template',
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
			getListSettingGroup({
				heading: 'Templates',
				emptyState: 'No input field templates configured.',
				items: templates,
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
		return {
			name: template.name || `Input field template ${index + 1}`,
			desc: template.declaration || 'No declaration.',
			searchable: true,
			aliases: [template.name, template.declaration].filter(x => x !== ''),
			render: (setting: Setting): void => {
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
