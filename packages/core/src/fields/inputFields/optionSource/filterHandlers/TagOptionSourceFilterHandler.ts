import type {
	OptionSourceCandidate,
	OptionSourceContext,
	OptionSourceFilterHandler,
} from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceTypes';
import { normalizeTag } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceUtils';

export class TagOptionSourceFilterHandler implements OptionSourceFilterHandler {
	filterName = 'tag';
	sourceTypes = ['file'];

	apply(candidate: OptionSourceCandidate, value: string, context: OptionSourceContext): boolean {
		const path = candidate.path ?? candidate.value;
		const tag = normalizeTag(value);
		return context.mb.file.getFileTags(path).map(normalizeTag).includes(tag);
	}
}
