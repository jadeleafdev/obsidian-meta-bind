import type { MetaBind } from 'meta-bind-core/src';
import type { UseLinksInputFieldArgumentValue } from 'meta-bind-core/src/config/FieldConfigs';
import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';

export interface OptionSourceOption {
	value: MBLiteral;
	name: string;
	description?: string;
}

export interface OptionSourceQuery {
	sourceType: string;
	filters: OptionSourceFilter[];
}

export interface OptionSourceFilter {
	name: string;
	value: string;
}

export interface OptionSourceCandidate {
	sourceType: string;
	value: string;
	path?: string;
}

export interface OptionSourceContext {
	mb: MetaBind;
	useLinks?: UseLinksInputFieldArgumentValue;
}

export interface OptionSourceHandler {
	sourceType: string;
	createCandidates(context: OptionSourceContext): OptionSourceCandidate[];
	createOption(candidate: OptionSourceCandidate, context: OptionSourceContext): OptionSourceOption;
}

export interface OptionSourceFilterHandler {
	filterName: string;
	sourceTypes: string[];
	apply(candidate: OptionSourceCandidate, value: string, context: OptionSourceContext): boolean;
}
