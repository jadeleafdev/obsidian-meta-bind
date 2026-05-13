import type { ViewFieldType } from 'meta-bind-core/src/config/FieldConfigs';
import type { ViewFieldArgumentContainer } from 'meta-bind-core/src/fields/fieldArguments/viewFieldArguments/ViewFieldArgumentContainer';
import type {
	BindTargetDeclaration,
	UnvalidatedBindTargetDeclaration,
} from 'meta-bind-core/src/parsers/bindTargetParser/BindTargetDeclaration';
import type {
	FieldDeclaration,
	SimpleFieldArgument,
	UnvalidatedFieldArgument,
} from 'meta-bind-core/src/parsers/FieldDeclaration';
import type { ParsingResultNode } from 'meta-bind-core/src/parsers/nomParsers/GeneralNomParsers';

export interface ViewFieldDeclaration extends FieldDeclaration {
	templateDeclaration: (string | BindTargetDeclaration)[];
	viewFieldType: ViewFieldType;
	argumentContainer: ViewFieldArgumentContainer;
	writeToBindTarget?: BindTargetDeclaration | undefined;
}

export interface UnvalidatedViewFieldDeclaration extends PartialUnvalidatedViewFieldDeclaration, FieldDeclaration {}

export interface PartialUnvalidatedViewFieldDeclaration {
	templateDeclaration?: (string | UnvalidatedBindTargetDeclaration)[] | undefined;
	viewFieldType?: ParsingResultNode | undefined;
	arguments: UnvalidatedFieldArgument[];
	writeToBindTarget?: UnvalidatedBindTargetDeclaration | undefined;
}

export interface SimpleViewFieldDeclaration {
	viewFieldType?: string | undefined;
	templateDeclaration?: (string | BindTargetDeclaration)[] | undefined;
	arguments?: SimpleFieldArgument[] | undefined;
	writeToBindTarget?: BindTargetDeclaration | undefined;
}

// ---
// JS View Field
// ---

export interface JsViewFieldDeclaration extends FieldDeclaration {
	bindTargetMappings: JsViewFieldBindTargetMapping[];
	writeToBindTarget?: BindTargetDeclaration | undefined;
	hidden: boolean;
	code: string;
}

export interface JsViewFieldBindTargetMapping {
	bindTarget: BindTargetDeclaration;
	name: string;
}

export interface UnvalidatedJsViewFieldDeclaration extends PartialUnvalidatedJsViewFieldDeclaration, FieldDeclaration {}

export interface PartialUnvalidatedJsViewFieldDeclaration {
	bindTargetMappings: UnvalidatedJsViewFieldBindTargetMapping[];
	writeToBindTarget?: UnvalidatedBindTargetDeclaration | undefined;
	hidden: boolean;
	code: string;
}

export interface UnvalidatedJsViewFieldBindTargetMapping {
	bindTarget: UnvalidatedBindTargetDeclaration;
	name: string;
}

export interface SimpleJsViewFieldDeclaration {
	bindTargetMappings: SimpleJsViewFieldBindTargetMapping[];
	writeToBindTarget?: BindTargetDeclaration | undefined;
	hidden?: boolean;
	code: string;
}

export interface SimpleJsViewFieldBindTargetMapping {
	bindTarget: BindTargetDeclaration;
	name: string;
}
