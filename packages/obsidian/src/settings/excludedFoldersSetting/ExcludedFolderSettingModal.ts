import type { App } from 'obsidian';
import { Modal, Notice, Setting } from 'obsidian';

export class ExcludedFolderSettingModal extends Modal {
	private readonly initialFolder: string;
	private readonly onSubmit: (folder: string) => void;
	private draft: string;

	constructor(app: App, folder: string | undefined, onSubmit: (folder: string) => void) {
		super(app);
		this.initialFolder = folder ?? '';
		this.draft = this.initialFolder;
		this.onSubmit = onSubmit;
	}

	onOpen(): void {
		this.contentEl.empty();
		this.setTitle(this.initialFolder === '' ? 'Add excluded folder' : 'Edit excluded folder');

		new Setting(this.contentEl).setName('Folder path').addText(cb => {
			cb.setPlaceholder('path/to/folder');
			cb.setValue(this.draft);
			cb.onChange(value => {
				this.draft = value;
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
					if (this.draft === '') {
						new Notice('meta-bind | Folder path may not be empty.');
						return;
					}

					this.onSubmit(this.draft);
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
