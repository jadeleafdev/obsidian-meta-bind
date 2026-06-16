import type { MetaBind } from 'meta-bind-core/src';
import { FieldMountable } from 'meta-bind-core/src/fields/FieldMountable';

export class ExcludedMountable extends FieldMountable {
	constructor(mb: MetaBind, uuid: string, filePath: string) {
		super(mb, uuid, filePath);
	}

	protected onMount(targetEl: HTMLElement): void {
		if (MB_DEBUG) console.debug('meta-bind | ExcludedMountable >> mount');
		super.onMount(targetEl);

		this.mb.domHelpers.empty(targetEl);

		this.mb.domHelpers.createElement(targetEl, 'span', {
			text: '[META_BIND] This folder has been excluded in the settings',
			class: 'mb-error',
		});
	}

	protected onUnmount(targetEl: HTMLElement): void {
		if (MB_DEBUG) console.debug('meta-bind | ExcludedMountable >> unmount');
		super.onUnmount(targetEl);

		this.mb.domHelpers.empty(targetEl);

		this.mb.domHelpers.showUnloadedMessage(targetEl, 'Excluded');
	}
}
