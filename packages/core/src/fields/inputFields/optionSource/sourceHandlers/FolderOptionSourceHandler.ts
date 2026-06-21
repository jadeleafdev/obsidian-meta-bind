import type {
	OptionSourceCandidate,
	OptionSourceContext,
	OptionSourceHandler,
	OptionSourceOption,
} from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceTypes';
import { getFileName } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceUtils';

export class FolderOptionSourceHandler implements OptionSourceHandler {
	sourceType = 'folder';

	createCandidates(context: OptionSourceContext): OptionSourceCandidate[] {
		return context.mb.file.getAllFolders().map(path => ({
			sourceType: this.sourceType,
			value: path,
			path: path,
		}));
	}

	createOption(candidate: OptionSourceCandidate): OptionSourceOption {
		const path = candidate.path ?? candidate.value;
		return {
			value: path,
			name: path === '' ? '/' : getFileName(path),
			description: `folder: ${path}`,
		};
	}
}
