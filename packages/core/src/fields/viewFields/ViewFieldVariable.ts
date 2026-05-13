import type { BindTargetDeclaration } from 'meta-bind-core/src/parsers/bindTargetParser/BindTargetDeclaration';
import type { Signal } from 'meta-bind-core/src/utils/Signal';

export interface ViewFieldVariable {
	bindTargetDeclaration: BindTargetDeclaration;
	metadataSignal: Signal<unknown>;
	uuid: string;
	contextName: string | undefined;
}
