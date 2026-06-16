import type { MetaBind } from 'meta-bind-core/src';
import type { NotePosition } from 'meta-bind-core/src/config/APIConfigs';
import { RenderChildType } from 'meta-bind-core/src/config/APIConfigs';
import { ButtonField } from 'meta-bind-core/src/fields/button/ButtonField';
import { FieldMountable } from 'meta-bind-core/src/fields/FieldMountable';
import type { ButtonDeclaration } from 'meta-bind-core/src/parsers/ButtonParser';
import { ErrorCollection } from 'meta-bind-core/src/utils/errors/ErrorCollection';

export class ButtonMountable extends FieldMountable {
	errorCollection: ErrorCollection;

	declaration: ButtonDeclaration;
	position: NotePosition | undefined;
	buttonField: ButtonField | undefined;
	isPreview: boolean;

	constructor(
		mb: MetaBind,
		uuid: string,
		filePath: string,
		declaration: ButtonDeclaration,
		position: NotePosition | undefined,
		isPreview: boolean,
	) {
		super(mb, uuid, filePath);

		this.declaration = declaration;
		this.position = position;
		this.isPreview = isPreview;

		this.errorCollection = new ErrorCollection(this.getUuid());
		this.errorCollection.merge(declaration.errorCollection);
	}

	protected onMount(targetEl: HTMLElement): void {
		if (MB_DEBUG) console.debug('meta-bind | ButtonMountable >> mount', this.declaration.declarationString);
		super.onMount(targetEl);

		this.mb.domHelpers.removeAllClasses(targetEl);

		if (this.declaration.config && this.declaration.errorCollection.isEmpty()) {
			try {
				this.buttonField = new ButtonField(
					this.mb,
					this.declaration.config,
					this.getFilePath(),
					RenderChildType.BLOCK,
					this.position,
					false,
					this.isPreview,
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
		if (MB_DEBUG) console.debug('meta-bind | ButtonMountable >> destroy', this.declaration.declarationString);
		super.onUnmount(targetEl);

		this.buttonField?.unmount();

		this.mb.domHelpers.showUnloadedMessage(targetEl, 'button');
	}
}
