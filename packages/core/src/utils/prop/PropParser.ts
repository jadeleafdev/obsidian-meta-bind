import type { UnvalidatedPropAccess } from 'meta-bind-core/src/parsers/bindTargetParser/BindTargetDeclaration';
import { toResultNode } from 'meta-bind-core/src/parsers/nomParsers/GeneralNomParsers';
import { P_int } from 'meta-bind-core/src/parsers/nomParsers/MiscNomParsers';
import { PropAccess, PropAccessType } from 'meta-bind-core/src/utils/prop/PropAccess';
import { PropPath } from 'meta-bind-core/src/utils/prop/PropPath';

export function parsePropPath(arr: string[]): PropPath {
	return new PropPath(
		arr.map(x => {
			if (P_int.tryParse(x).success) {
				return new PropAccess(PropAccessType.ARRAY, x);
			} else {
				return new PropAccess(PropAccessType.OBJECT, x);
			}
		}),
	);
}

export function parsePropPathUnvalidated(arr: string[]): UnvalidatedPropAccess[] {
	return arr.map(x => {
		if (P_int.tryParse(x).success) {
			return {
				prop: toResultNode(x),
				type: PropAccessType.ARRAY,
			};
		} else {
			return {
				prop: toResultNode(x),
				type: PropAccessType.OBJECT,
			};
		}
	});
}
