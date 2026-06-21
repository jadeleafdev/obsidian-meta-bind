import type { MetaBind } from 'meta-bind-core/src';
import type { UseLinksInputFieldArgumentValue } from 'meta-bind-core/src/config/FieldConfigs';
import type { OptionSourceInputFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/arguments/OptionSourceInputFieldArgument';
import { SuggesterOption } from 'meta-bind-core/src/fields/inputFields/fields/Suggester/SuggesterHelper';
import { ExtensionOptionSourceFilterHandler } from 'meta-bind-core/src/fields/inputFields/optionSource/filterHandlers/ExtensionOptionSourceFilterHandler';
import { FromOptionSourceFilterHandler } from 'meta-bind-core/src/fields/inputFields/optionSource/filterHandlers/FromOptionSourceFilterHandler';
import { TagOptionSourceFilterHandler } from 'meta-bind-core/src/fields/inputFields/optionSource/filterHandlers/TagOptionSourceFilterHandler';
import { parseOptionSourceQuery } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceParser';
import type {
	OptionSourceFilterHandler,
	OptionSourceHandler,
	OptionSourceOption,
} from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceTypes';
import { deduplicateOptions } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceUtils';
import { FileOptionSourceHandler } from 'meta-bind-core/src/fields/inputFields/optionSource/sourceHandlers/FileOptionSourceHandler';
import { FolderOptionSourceHandler } from 'meta-bind-core/src/fields/inputFields/optionSource/sourceHandlers/FolderOptionSourceHandler';
import { TagOptionSourceHandler } from 'meta-bind-core/src/fields/inputFields/optionSource/sourceHandlers/TagOptionSourceHandler';
import { ErrorLevel, MetaBindArgumentError } from 'meta-bind-core/src/utils/errors/MetaBindErrors';
import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';
import { stringifyLiteral } from 'meta-bind-core/src/utils/Literal';

export class OptionSourceResolver {
	private readonly sourceHandlers: Record<string, OptionSourceHandler>;
	private readonly filterHandlers: Record<string, OptionSourceFilterHandler>;

	constructor() {
		this.sourceHandlers = {};
		this.filterHandlers = {};

		this.registerSourceHandler(new FileOptionSourceHandler());
		this.registerSourceHandler(new FolderOptionSourceHandler());
		this.registerSourceHandler(new TagOptionSourceHandler());

		this.registerFilterHandler(new FromOptionSourceFilterHandler());
		this.registerFilterHandler(new ExtensionOptionSourceFilterHandler());
		this.registerFilterHandler(new TagOptionSourceFilterHandler());
	}

	resolve(
		mb: MetaBind,
		optionSourceArgs: OptionSourceInputFieldArgument[],
		useLinks?: UseLinksInputFieldArgumentValue,
	): OptionSourceOption[] {
		const options: OptionSourceOption[] = [];

		for (const arg of optionSourceArgs) {
			try {
				options.push(...this.resolveQuery(mb, arg.value, useLinks));
			} catch (e) {
				const error = e instanceof MetaBindArgumentError ? e : this.createError(arg.value, e);
				mb.internal.showNotice(`meta-bind | ${error.message}`);
				console.warn(error);
			}
		}

		return deduplicateOptions(options);
	}

	resolveToSuggesterOptions(
		mb: MetaBind,
		optionSourceArgs: OptionSourceInputFieldArgument[],
		useLinks: UseLinksInputFieldArgumentValue,
	): SuggesterOption<MBLiteral>[] {
		return this.resolve(mb, optionSourceArgs, useLinks).map(
			option => new SuggesterOption(option.value, option.name, option.description),
		);
	}

	resolveToImageSuggesterOptions(
		mb: MetaBind,
		optionSourceArgs: OptionSourceInputFieldArgument[],
	): SuggesterOption<string>[] {
		return this.resolve(mb, optionSourceArgs).map(
			option => new SuggesterOption(stringifyLiteral(option.value), option.name, option.description),
		);
	}

	private resolveQuery(
		mb: MetaBind,
		queryString: string,
		useLinks: UseLinksInputFieldArgumentValue | undefined,
	): OptionSourceOption[] {
		const query = parseOptionSourceQuery(queryString);
		const sourceHandler = this.sourceHandlers[query.sourceType];
		if (sourceHandler === undefined) {
			throw new MetaBindArgumentError({
				errorLevel: ErrorLevel.WARNING,
				effect: 'failed to resolve option source',
				cause: `unknown option source type '${query.sourceType}'`,
			});
		}

		const context = { mb, useLinks };
		let candidates = sourceHandler.createCandidates(context);

		for (const filter of query.filters) {
			const filterHandler = this.filterHandlers[filter.name];
			if (filterHandler === undefined) {
				throw new MetaBindArgumentError({
					errorLevel: ErrorLevel.WARNING,
					effect: 'failed to resolve option source',
					cause: `unknown option source filter '${filter.name}'`,
				});
			}
			if (!filterHandler.sourceTypes.includes(query.sourceType)) {
				throw new MetaBindArgumentError({
					errorLevel: ErrorLevel.WARNING,
					effect: 'failed to resolve option source',
					cause: `option source filter '${filter.name}' can not be used with source '${query.sourceType}'`,
				});
			}

			candidates = candidates.filter(candidate => filterHandler.apply(candidate, filter.value, context));
		}

		return candidates.map(candidate => sourceHandler.createOption(candidate, context));
	}

	private registerSourceHandler(handler: OptionSourceHandler): void {
		this.sourceHandlers[handler.sourceType] = handler;
	}

	private registerFilterHandler(handler: OptionSourceFilterHandler): void {
		this.filterHandlers[handler.filterName] = handler;
	}

	private createError(queryString: string, cause: unknown): MetaBindArgumentError {
		return new MetaBindArgumentError({
			errorLevel: ErrorLevel.WARNING,
			effect: 'failed to resolve option source',
			cause: cause instanceof Error ? cause : `invalid option source query '${queryString}'`,
		});
	}
}
