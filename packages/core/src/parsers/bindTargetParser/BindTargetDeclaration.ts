import type { ParsingResultNode } from 'meta-bind-core/src/parsers/nomParsers/GeneralNomParsers';
import type { PropAccessType } from 'meta-bind-core/src/utils/prop/PropAccess';
import type { PropPath } from 'meta-bind-core/src/utils/prop/PropPath';

export interface BindTargetDeclaration {
	storageType: string;
	storagePath: string;
	storageProp: PropPath;
	listenToChildren: boolean;
}

export interface UnvalidatedBindTargetDeclaration {
	storageType?: ParsingResultNode | undefined;
	storagePath?: ParsingResultNode | undefined;
	storageProp: UnvalidatedPropAccess[];
	listenToChildren: boolean;
}

export interface UnvalidatedPropAccess {
	type: PropAccessType;
	prop: ParsingResultNode;
}

export interface SimplePropAccess {
	type: PropAccessType;
	prop: string;
}

export enum BindTargetStorageType {
	FRONTMATTER = 'frontmatter',
	MEMORY = 'memory',
	GLOBAL_MEMORY = 'globalMemory',
	SCOPE = 'scope',
}
