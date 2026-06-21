import type {
	OptionSourceCandidate,
	OptionSourceContext,
	OptionSourceFilterHandler,
} from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceTypes';
import { normalizeTag, pathIsOrIsInside } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceUtils';

export class FromOptionSourceFilterHandler implements OptionSourceFilterHandler {
	filterName = 'from';
	sourceTypes = ['file', 'folder', 'tag'];

	apply(candidate: OptionSourceCandidate, value: string, _context: OptionSourceContext): boolean {
		if (candidate.sourceType === 'tag') {
			const tag = normalizeTag(value);
			return candidate.value === tag || candidate.value.startsWith(`${tag}/`);
		}

		return pathIsOrIsInside(candidate.path ?? candidate.value, value);
	}
}
