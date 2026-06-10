import type { ObsMetaBind } from 'meta-bind-obsidian/src/ObsMB';
import { ExcludedFolderSettingModal } from 'meta-bind-obsidian/src/settings/excludedFoldersSetting/ExcludedFolderSettingModal';
import { getListSettingGroup, updateListItems } from 'meta-bind-obsidian/src/settings/ListSettingGroup';
import type { MetaBindSettingKey } from 'meta-bind-obsidian/src/settings/SettingsTypes';
import type { App, Setting, SettingDefinitionItem, SettingGroupItem } from 'obsidian';

export class ExcludedFolderSettings {
	constructor(
		private readonly app: App,
		private readonly mb: ObsMetaBind,
		private readonly onUpdate: () => void,
	) {}

	getDisplayValue(): string {
		const count = this.mb.getSettings().excludedFolders.length;
		return `${count} folder${count === 1 ? '' : 's'}`;
	}

	getStatus(): 'warning' | null {
		return this.mb.getSettings().excludedFolders.some(folder => this.getFolderWarning(folder) !== null)
			? 'warning'
			: null;
	}

	getDefinitions(): SettingDefinitionItem<MetaBindSettingKey>[] {
		const folders = this.mb.getSettings().excludedFolders;

		return [
			getListSettingGroup(this.mb, {
				heading: 'Folders',
				emptyState: 'No excluded folders configured.',
				items: folders,
				addItems: {
					type: 'single',
					label: 'Add folder',
					action: (): void => {
						this.openExcludedFolderModal(undefined, folder => {
							updateListItems(
								this.mb.getSettings().excludedFolders,
								folders => {
									folders.push(folder);
								},
								folders => this.applyExcludedFolders(folders),
								this.onUpdate,
							);
						});
					},
				},
				renderItem: (folder, index) => this.getExcludedFolderSetting(folder, index),
				applyItems: folders => this.applyExcludedFolders(folders),
				onUpdate: this.onUpdate,
			}),
		];
	}

	private getExcludedFolderSetting(folder: string, index: number): SettingGroupItem<MetaBindSettingKey> {
		const warning = this.getFolderWarning(folder);

		return {
			name: folder || `Excluded folder ${index + 1}`,
			desc: warning ?? 'Plugin behavior is disabled in this folder.',
			searchable: folder !== '',
			render: (setting: Setting): void => {
				if (warning !== null) {
					setting.addDisplayValue(display => {
						display.setValue(folder === '' ? 'Invalid' : 'Missing').setStatus('warning');
					});
				}
				setting.addExtraButton(cb => {
					cb.setIcon('pencil');
					cb.setTooltip('Edit folder');
					cb.onClick(() => {
						this.openExcludedFolderModal(folder, newFolder => {
							updateListItems(
								this.mb.getSettings().excludedFolders,
								folders => {
									folders[index] = newFolder;
								},
								folders => this.applyExcludedFolders(folders),
								this.onUpdate,
							);
						});
					});
				});
			},
		};
	}

	private getFolderWarning(folder: string): string | null {
		if (folder === '') {
			return 'Folder path may not be empty.';
		}
		if (!this.app.workspace.layoutReady) {
			return null;
		}
		if (this.app.vault.getFolderByPath(folder) === null) {
			return 'This folder does not exist in the vault.';
		}
		return null;
	}

	private applyExcludedFolders(folders: string[]): boolean {
		this.mb.updateSettings(settings => {
			settings.excludedFolders = folders;
		});

		return true;
	}

	private openExcludedFolderModal(folder: string | undefined, onSubmit: (folder: string) => void): void {
		new ExcludedFolderSettingModal(this.app, folder, onSubmit).open();
	}
}
