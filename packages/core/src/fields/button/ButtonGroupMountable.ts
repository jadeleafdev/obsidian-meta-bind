import type { MetaBind } from 'meta-bind-core/src';
import type { NotePosition, RenderChildType } from 'meta-bind-core/src/config/APIConfigs';
import { ButtonGroupField } from 'meta-bind-core/src/fields/button/ButtonGroupField';
import { FieldMountable } from 'meta-bind-core/src/fields/FieldMountable';
import type { ButtonGroupDeclaration } from 'meta-bind-core/src/parsers/ButtonParser';
import { ErrorCollection } from 'meta-bind-core/src/utils/errors/ErrorCollection';

export class ButtonGroupMountable extends FieldMountable {
	errorCollection: ErrorCollection;

	declaration: ButtonGroupDeclaration;
	buttonField: ButtonGroupField | undefined;

	renderChildType: RenderChildType;
	position: NotePosition | undefined;

	constructor(
		mb: MetaBind,
		uuid: string,
		filePath: string,
		declaration: ButtonGroupDeclaration,
		renderChildType: RenderChildType,
		position: NotePosition | undefined,
	) {
		super(mb, uuid, filePath);

		this.declaration = declaration;

		this.errorCollection = new ErrorCollection(this.getUuid());
		this.errorCollection.merge(declaration.errorCollection);

		this.renderChildType = renderChildType;
		this.position = position;
	}

	protected onMount(targetEl: HTMLElement): void {
		MB_DEBUG && console.debug('meta-bind | ButtonGroupMountable >> mount', this.declaration);
		super.onMount(targetEl);

		this.mb.domHelpers.removeAllClasses(targetEl);

		if (this.declaration.errorCollection.isEmpty()) {
			try {
				this.buttonField = new ButtonGroupField(
					this.mb,
					this.declaration.referencedButtonIds,
					this.getFilePath(),
					this.renderChildType,
					this.position,
				);
				this.buttonField.mount(targetEl);
			} catch (e) {
				this.errorCollection.add(e);
				this.renderErrorIndicator(targetEl);
			}
		} else {
			this.renderErrorIndicator(targetEl);
		}
	}

	private renderErrorIndicator(targetEl: HTMLElement): void {
		this.mb.internal.createErrorIndicator(targetEl, {
			errorCollection: this.errorCollection,
			errorText:
				'Errors caused the creation of the field to fail. Sometimes one error only occurs because of another.',
			warningText:
				'Warnings will not cause the creation of a field to fail, but they indicate that a part of the declaration was invalid or uses deprecated functionality.',
			code: this.declaration.declarationString,
		});
	}

	protected onUnmount(targetEl: HTMLElement): void {
		MB_DEBUG && console.debug('meta-bind | ButtonGroupMountable >> destroy', this.declaration);
		super.onUnmount(targetEl);

		this.buttonField?.unmount();

		this.mb.domHelpers.showUnloadedMessage(targetEl, 'inline button');
	}
}
