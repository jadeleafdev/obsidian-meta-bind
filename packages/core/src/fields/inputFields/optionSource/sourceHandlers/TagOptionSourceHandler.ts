import type {
	OptionSourceCandidate,
	OptionSourceContext,
	OptionSourceHandler,
	OptionSourceOption,
} from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceTypes';
import { normalizeTag } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceUtils';

export class TagOptionSourceHandler implements OptionSourceHandler {
	sourceType = 'tag';

	createCandidates(context: OptionSourceContext): OptionSourceCandidate[] {
		return context.mb.file.getAllTags().map(tag => ({
			sourceType: this.sourceType,
			value: normalizeTag(tag),
		}));
	}

	createOption(candidate: OptionSourceCandidate): OptionSourceOption {
		return {
			value: candidate.value,
			name: candidate.value,
			description: 'tag',
		};
	}
}
