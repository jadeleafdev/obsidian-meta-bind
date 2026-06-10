import type { MetaBind } from 'meta-bind-core';
import { MetaBindError } from 'meta-bind-core/src/utils/errors/MetaBindErrors';
import type { MetaBindSettingKey } from 'meta-bind-obsidian/src/settings/SettingsTypes';
import type { SettingDefinitionItem, SettingGroupItem } from 'obsidian';

export interface ListSettingGroupOptions<T> {
	heading: string;
	emptyState: string;
	items: T[];
	addItems: ListSettingAddItemOptions;
	renderItem: (item: T, index: number) => SettingGroupItem<MetaBindSettingKey>;
	applyItems: (items: T[]) => boolean;
	onUpdate: () => void;
}

interface ListSettingSingleAddItemOptions {
	type: 'single';
	label: string;
	action: () => void;
}

interface ListSettingMultipleAddItemOptions {
	type: 'multiple';
	label: string;
	options: {
		label: string;
		action: () => void;
	}[];
}

export type ListSettingAddItemOptions = ListSettingSingleAddItemOptions | ListSettingMultipleAddItemOptions;

export function getListSettingGroup<T>(
	mb: MetaBind,
	options: ListSettingGroupOptions<T>,
): SettingDefinitionItem<MetaBindSettingKey> {
	return {
		type: 'list',
		heading: options.heading,
		emptyState: options.emptyState,
		items: options.items.map((item, index) => options.renderItem(item, index)),
		addItem: {
			name: options.addItems.label,
			action: (el: HTMLElement): void => {
				if (options.addItems.type === 'single') {
					options.addItems.action();
				} else {
					mb.internal
						.createContextMenu(
							options.addItems.options.map(option => ({
								name: option.label,
								onclick: (): void => {
									option.action();
								},
							})),
						)
						.showAtElement(el);
				}
			},
		},
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

export function getValidationMessage(error: unknown, fallback: string): string {
	if (error instanceof MetaBindError) {
		return error.cause instanceof Error ? error.cause.message : error.cause;
	}
	return error instanceof Error ? error.message : fallback;
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
