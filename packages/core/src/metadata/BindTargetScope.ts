import type { BindTargetDeclaration } from 'meta-bind-core/src/parsers/bindTargetParser/BindTargetDeclaration';

export class BindTargetScope {
	scope: BindTargetDeclaration;

	constructor(scope: BindTargetDeclaration) {
		this.scope = scope;
	}
}
