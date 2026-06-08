import type { InputFieldTemplate } from 'meta-bind-core/src/Settings';
import type { App } from 'obsidian';
import { Modal, Setting } from 'obsidian';

export class InputFieldTemplateSettingModal extends Modal {
	private readonly initialTemplate: InputFieldTemplate;
	private readonly onSubmit: (template: InputFieldTemplate) => boolean | void;
	private draft: InputFieldTemplate;

	constructor(
		app: App,
		template: InputFieldTemplate | undefined,
		onSubmit: (template: InputFieldTemplate) => boolean | void,
	) {
		super(app);
		this.initialTemplate = structuredClone(template ?? { name: '', declaration: '' });
		this.draft = structuredClone(this.initialTemplate);
		this.onSubmit = onSubmit;
	}

	onOpen(): void {
		this.contentEl.empty();
		this.setTitle(this.initialTemplate.name === '' ? 'Add input field template' : 'Edit input field template');

		new Setting(this.contentEl).setName('Name').addText(cb => {
			cb.setPlaceholder('template-name');
			cb.setValue(this.draft.name);
			cb.onChange(value => {
				this.draft.name = value;
			});
		});

		new Setting(this.contentEl)
			.setName('Declaration')
			.setDesc('Template declaration used after the template name.')
			.addTextArea(cb => {
				cb.setPlaceholder('INPUT[slider(addLabels)]');
				cb.setValue(this.draft.declaration);
				cb.inputEl.addClass('mb-settings-list-modal-textarea');
				cb.onChange(value => {
					this.draft.declaration = value;
				});
			});

		this.addModalButtons();
	}

	private addModalButtons(): void {
		new Setting(this.contentEl)
			.addButton(cb => {
				cb.setCta();
				cb.setButtonText('Save');
				cb.onClick(() => {
					if (this.onSubmit(structuredClone(this.draft)) === false) {
						return;
					}
					this.close();
				});
			})
			.addButton(cb => {
				cb.setButtonText('Cancel');
				cb.onClick(() => {
					this.close();
				});
			});
	}
}
