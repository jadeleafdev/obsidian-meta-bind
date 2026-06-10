import type { DomHelpers } from 'meta-bind-core/src/api/DomHelpers';
import type { ContextMenuItemDefinition, IContextMenu } from 'meta-bind-core/src/utils/IContextMenu';
import { Menu } from 'obsidian';

export class ObsContextMenu implements IContextMenu {
	menu: Menu;
	private readonly domHelpers: DomHelpers;

	constructor(domHelpers: DomHelpers) {
		this.menu = new Menu();
		this.domHelpers = domHelpers;
	}

	public setItems(items: ContextMenuItemDefinition[]): void {
		for (const item of items) {
			this.menu.addItem(menuItem => {
				menuItem.setTitle(item.name);
				if (item.icon) {
					menuItem.setIcon(item.icon);
				}
				if (item.warning) {
					menuItem.setWarning(item.warning);
				}
				menuItem.onClick(item.onclick);
			});
		}
	}

	public show(x: number, y: number): void {
		this.menu.showAtPosition({ x, y }, this.domHelpers.activeDocument);
	}

	public showAtElement(el: HTMLElement): void {
		this.menu.showAtPosition(
			{ x: el.getBoundingClientRect().right, y: el.getBoundingClientRect().bottom },
			this.domHelpers.activeDocument,
		);
	}

	public showWithEvent(event: MouseEvent): void {
		this.menu.showAtMouseEvent(event);
		event.stopImmediatePropagation();
		event.preventDefault();
	}
}
