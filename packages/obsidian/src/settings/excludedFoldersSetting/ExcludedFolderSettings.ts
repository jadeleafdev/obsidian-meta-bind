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

	getDefinitions(): SettingDefinitionItem<MetaBindSettingKey>[] {
		const folders = this.mb.getSettings().excludedFolders;

		return [
			{
				name: 'Add folder',
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
			getListSettingGroup({
				heading: 'Folders',
				emptyState: 'No excluded folders configured.',
				items: folders,
				renderItem: (folder, index) => this.getExcludedFolderSetting(folder, index),
				applyItems: folders => this.applyExcludedFolders(folders),
				onUpdate: this.onUpdate,
			}),
		];
	}

	private getExcludedFolderSetting(folder: string, index: number): SettingGroupItem<MetaBindSettingKey> {
		return {
			name: folder || `Excluded folder ${index + 1}`,
			desc: folder === '' ? 'Folder path may not be empty.' : 'Plugin behavior is disabled in this folder.',
			searchable: folder !== '',
			render: (setting: Setting): void => {
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
