import type { MetaBind } from 'meta-bind-core/src';
import type { NotePosition } from 'meta-bind-core/src/config/APIConfigs';
import { RenderChildType } from 'meta-bind-core/src/config/APIConfigs';
import type { ButtonConfig } from 'meta-bind-core/src/config/ButtonConfig';
import { ButtonStyleType } from 'meta-bind-core/src/config/ButtonConfig';
import { ButtonField } from 'meta-bind-core/src/fields/button/ButtonField';
import { Mountable } from 'meta-bind-core/src/utils/Mountable';
import type { Component as SvelteComponent } from 'svelte';
import { mount, unmount } from 'svelte';
import ButtonComponent from 'meta-bind-core/src/utils/components/ButtonComponent.svelte';

export class ButtonGroupField extends Mountable {
	mb: MetaBind;
	referencedIds: string[];
	filePath: string;
	renderChildType: RenderChildType;
	notePosition: NotePosition | undefined;

	constructor(
		mb: MetaBind,
		referencedIds: string[],
		filePath: string,
		renderChildType: RenderChildType,
		notePosition: NotePosition | undefined,
	) {
		super();

		this.mb = mb;
		this.referencedIds = referencedIds;
		this.filePath = filePath;
		this.renderChildType = renderChildType;
		this.notePosition = notePosition;
	}

	private renderInitialButton(element: HTMLElement, buttonId: string): ReturnType<SvelteComponent> {
		this.mb.domHelpers.removeAllClasses(element);
		this.mb.domHelpers.addClasses(element, [
			'mb-button',
			this.renderChildType === RenderChildType.INLINE ? 'mb-button-inline' : 'mb-button-block',
		]);

		return mount(ButtonComponent, {
			target: element,
			props: {
				mb: this.mb,
				variant: ButtonStyleType.DEFAULT,
				label: 'Button ID not Found',
				tooltip: `No button with id '${buttonId}' found`,
				error: true,
				onclick: async (): Promise<void> => {},
			},
		});
	}

	protected onMount(targetEl: HTMLElement): void {
		this.mb.domHelpers.empty(targetEl);
		this.mb.domHelpers.addClasses(targetEl, [
			'mb-button-group',
			this.renderChildType === RenderChildType.INLINE ? 'mb-button-group-inline' : 'mb-button-group-block',
		]);

		for (const buttonId of this.referencedIds) {
			const wrapperEl = this.mb.domHelpers.createElement(targetEl, 'span');

			let initialButton: ReturnType<SvelteComponent> | undefined = this.renderInitialButton(wrapperEl, buttonId);
			let button: ButtonField | undefined;
			let releaseButton: (() => void) | undefined;

			const loadListenerCleanup = this.mb.buttonManager.registerButtonLoadListener(
				this.filePath,
				buttonId,
				(buttonConfig: ButtonConfig) => {
					if (this.renderChildType === RenderChildType.INLINE) {
						releaseButton?.();
						releaseButton = this.mb.buttonManager.retainButton(this.filePath, buttonId);
					}

					if (initialButton) {
						void unmount(initialButton);
					}
					initialButton = undefined;
					button?.unmount();
					button = new ButtonField(
						this.mb,
						buttonConfig,
						this.filePath,
						this.renderChildType,
						this.notePosition,
						true,
						false,
					);
					button.mount(wrapperEl);
				},
			);

			this.registerUnmountCb(() => {
				if (initialButton) {
					void unmount(initialButton);
				}
				initialButton = undefined;
				button?.unmount();
				releaseButton?.();
				loadListenerCleanup();
			});
		}
	}

	protected onUnmount(targetEl: HTMLElement): void {
		this.mb.domHelpers.empty(targetEl);
	}
}
