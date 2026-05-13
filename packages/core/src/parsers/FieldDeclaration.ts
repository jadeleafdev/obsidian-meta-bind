import type { ParsingResultNode } from 'meta-bind-core/src/parsers/nomParsers/GeneralNomParsers';
import type { ErrorCollection } from 'meta-bind-core/src/utils/errors/ErrorCollection';

export interface FieldDeclaration {
	declarationString?: string | undefined;
	errorCollection: ErrorCollection;
}

export interface SimpleFieldArgument {
	name: string;
	value: string[];
}

export interface UnvalidatedFieldArgument {
	name: ParsingResultNode;
	value: ParsingResultNode[];
}
