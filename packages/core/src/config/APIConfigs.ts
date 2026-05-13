import type { ButtonConfig } from 'meta-bind-core/src/config/ButtonConfig';
import type { MetaBindColumnDeclaration } from 'meta-bind-core/src/fields/metaBindTable/TableMountable';
import type { BindTargetScope } from 'meta-bind-core/src/metadata/BindTargetScope';
import type { BindTargetDeclaration } from 'meta-bind-core/src/parsers/bindTargetParser/BindTargetDeclaration';
import type { SimpleButtonGroupDeclaration } from 'meta-bind-core/src/parsers/ButtonParser';
import type { SimpleInputFieldDeclaration } from 'meta-bind-core/src/parsers/inputFieldParser/InputFieldDeclaration';
import type {
	SimpleJsViewFieldDeclaration,
	SimpleViewFieldDeclaration,
} from 'meta-bind-core/src/parsers/viewFieldParser/ViewFieldDeclaration';

export enum RenderChildType {
	INLINE = 'inline',
	BLOCK = 'block',
}

export enum FieldType {
	INPUT = 'INPUT',
	VIEW = 'VIEW',
	JS_VIEW = 'JS_VIEW',
	TABLE = 'TABLE',
	BUTTON_GROUP = 'BUTTON_GROUP',
	BUTTON = 'BUTTON',
	EMBED = 'EMBED',
	EXCLUDED = 'EXCLUDED',
}

export interface InputFieldOptions {
	renderChildType: RenderChildType;
	declaration: SimpleInputFieldDeclaration | string;
	scope?: BindTargetScope | undefined;
}

export interface ViewFieldOptions {
	renderChildType: RenderChildType;
	declaration: SimpleViewFieldDeclaration | string;
	scope?: BindTargetScope | undefined;
}

export interface JsViewFieldOptions {
	declaration: SimpleJsViewFieldDeclaration | string;
}

export interface TableOptions {
	bindTarget: BindTargetDeclaration;
	tableHead: string[];
	columns: MetaBindColumnDeclaration[];
}

export interface ButtonGroupOptions {
	renderChildType: RenderChildType;
	declaration: SimpleButtonGroupDeclaration | string;
	position?: NotePosition | undefined;
}

export interface ButtonOptions {
	declaration: ButtonConfig | string;
	position?: NotePosition | undefined;
	isPreview: boolean;
}

export class NotePosition {
	linePosition: LinePosition | undefined;

	constructor(linePosition: LinePosition | undefined) {
		this.linePosition = linePosition;
	}

	getPosition(): LinePosition | undefined {
		return this.linePosition;
	}
}

export interface LinePosition {
	lineStart: number;
	lineEnd: number;
}

export interface EmbedOptions {
	depth: number;
	content: string;
}

export interface FieldOptionMap {
	[FieldType.INPUT]: InputFieldOptions;
	[FieldType.VIEW]: ViewFieldOptions;
	[FieldType.JS_VIEW]: JsViewFieldOptions;
	[FieldType.TABLE]: TableOptions;
	[FieldType.BUTTON_GROUP]: ButtonGroupOptions;
	[FieldType.BUTTON]: ButtonOptions;
	[FieldType.EMBED]: EmbedOptions;
	[FieldType.EXCLUDED]: undefined;
}

export type InlineFieldType = FieldType.INPUT | FieldType.VIEW | FieldType.BUTTON_GROUP;

/**
 * @internal
 * @param type
 */
export function isFieldTypeAllowedInline(type: FieldType): type is InlineFieldType {
	return type === FieldType.INPUT || type === FieldType.VIEW || type === FieldType.BUTTON_GROUP;
}
