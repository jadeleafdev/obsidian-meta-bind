import { applyUseLinksArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/arguments/UseLinksInputFieldArgument';
import type {
	OptionSourceCandidate,
	OptionSourceContext,
	OptionSourceHandler,
	OptionSourceOption,
} from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceTypes';
import { getFileName } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceUtils';

export class FileOptionSourceHandler implements OptionSourceHandler {
	sourceType = 'file';

	createCandidates(context: OptionSourceContext): OptionSourceCandidate[] {
		return context.mb.file.getAllFiles().map(path => ({
			sourceType: this.sourceType,
			value: path,
			path: path,
		}));
	}

	createOption(candidate: OptionSourceCandidate, context: OptionSourceContext): OptionSourceOption {
		const path = candidate.path ?? candidate.value;
		const name = getFileName(path);
		return {
			value: context.useLinks === undefined ? path : applyUseLinksArgument(path, name, context.useLinks),
			name: name,
			description: `file: ${path}`,
		};
	}
}
