import type { MetaBindSettingKey } from 'meta-bind-obsidian/src/settings/SettingsTypes';
import type { SettingDefinitionItem, SettingGroupItem } from 'obsidian';

export interface ListSettingGroupOptions<T> {
	heading: string;
	emptyState: string;
	items: T[];
	renderItem: (item: T, index: number) => SettingGroupItem<MetaBindSettingKey>;
	applyItems: (items: T[]) => boolean;
	onUpdate: () => void;
}

export function getListSettingGroup<T>(options: ListSettingGroupOptions<T>): SettingDefinitionItem<MetaBindSettingKey> {
	return {
		type: 'list',
		heading: options.heading,
		emptyState: options.emptyState,
		items: options.items.map((item, index) => options.renderItem(item, index)),
		onDelete: (index: number): void => {
			updateListItems(
				options.items,
				items => {
					items.splice(index, 1);
				},
				options.applyItems,
				options.onUpdate,
			);
		},
		onReorder: (oldIndex: number, newIndex: number): void => {
			updateListItems(
				options.items,
				items => {
					moveListItem(items, oldIndex, newIndex);
				},
				options.applyItems,
				options.onUpdate,
			);
		},
	};
}

export function updateListItems<T>(
	items: T[],
	updateItems: (items: T[]) => void,
	applyItems: (items: T[]) => boolean,
	onUpdate: () => void,
): boolean {
	const nextItems = structuredClone(items);
	updateItems(nextItems);
	if (applyItems(nextItems)) {
		onUpdate();
		return true;
	}
	return false;
}

function moveListItem<T>(items: T[], oldIndex: number, newIndex: number): void {
	const [item] = items.splice(oldIndex, 1);
	items.splice(newIndex, 0, item);
}
