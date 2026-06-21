import type {
	OptionSourceCandidate,
	OptionSourceContext,
	OptionSourceFilterHandler,
} from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceTypes';

export class ExtensionOptionSourceFilterHandler implements OptionSourceFilterHandler {
	filterName = 'ext';
	sourceTypes = ['file'];

	apply(candidate: OptionSourceCandidate, value: string, _context: OptionSourceContext): boolean {
		const path = candidate.path ?? candidate.value;
		const extensions = value
			.split(',')
			.map(ext => ext.trim().replace(/^\./, '').toLowerCase())
			.filter(ext => ext.length > 0);
		const extension = path.split('.').at(-1)?.toLowerCase();

		return extension !== undefined && extensions.includes(extension);
	}
}
