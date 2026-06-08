import type { App, TFolder } from 'obsidian';
import { AbstractInputSuggest, Modal, Notice, Setting } from 'obsidian';

export class FolderSuggest extends AbstractInputSuggest<TFolder> {
	constructor(
		app: App,
		public inputEl: HTMLInputElement,
	) {
		super(app, inputEl);
	}

	getSuggestions(inputStr: string): TFolder[] {
		const lowerCaseInputStr = inputStr.toLowerCase();
		const folders = this.app.vault
			.getAllFolders()
			.filter(folder => folder.path.toLowerCase().includes(lowerCaseInputStr));

		return folders.slice(0, 1000);
	}

	renderSuggestion(file: TFolder, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TFolder): void {
		this.setValue(file.path);
		this.inputEl.trigger('input');
		this.close();
	}
}

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
			new FolderSuggest(this.app, cb.inputEl);
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
