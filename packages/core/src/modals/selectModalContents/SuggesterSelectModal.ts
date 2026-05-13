import type { MetaBind } from 'meta-bind-core/src';
import type {
	SuggesterLikeIFP,
	SuggesterOption,
} from 'meta-bind-core/src/fields/inputFields/fields/Suggester/SuggesterHelper';
import { SelectModalContent } from 'meta-bind-core/src/modals/SelectModalContent';
import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';

export class SuggesterSelectModal extends SelectModalContent<SuggesterOption<MBLiteral>> {
	ipf: SuggesterLikeIFP;

	constructor(mb: MetaBind, selectCallback: (value: SuggesterOption<MBLiteral>) => void, ipf: SuggesterLikeIFP) {
		super(mb, selectCallback);
		this.ipf = ipf;
	}

	public getItemText(item: SuggesterOption<MBLiteral>): string {
		return item.displayValue;
	}

	public getItemDescription(item: SuggesterOption<MBLiteral>): string | undefined {
		return item.displayDescription;
	}

	public getItems(): SuggesterOption<MBLiteral>[] {
		return this.mb.internal.getSuggesterOptions(this.ipf);
	}
}
