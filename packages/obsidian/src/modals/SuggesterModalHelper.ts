import { InputFieldArgumentType, UseLinksInputFieldArgumentValue } from 'meta-bind-core/src/config/FieldConfigs';
import type { OptionInputFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/arguments/OptionInputFieldArgument';
import type { OptionQueryInputFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/arguments/OptionQueryInputFieldArgument';
import type { OptionSourceInputFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/arguments/OptionSourceInputFieldArgument';
import { applyUseLinksArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/arguments/UseLinksInputFieldArgument';
import type { SuggesterLikeIFP } from 'meta-bind-core/src/fields/inputFields/fields/Suggester/SuggesterHelper';
import { SuggesterOption } from 'meta-bind-core/src/fields/inputFields/fields/Suggester/SuggesterHelper';
import { deduplicateOptions } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceUtils';
import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';
import type { ObsMetaBind } from 'meta-bind-obsidian/src/ObsMB';
import { getDataViewPluginAPI } from 'meta-bind-obsidian/src/ObsUtils';
import { Notice } from 'obsidian';
import type { DataArray, DataviewApi, Literal } from 'obsidian-dataview';
import { z } from 'zod';

export function getSuggesterOptions(
	mb: ObsMetaBind,
	filePath: string,
	optionArgs: OptionInputFieldArgument[],
	optionQueryArgs: OptionQueryInputFieldArgument[],
	optionSourceArgs: OptionSourceInputFieldArgument[],
	useLinks: UseLinksInputFieldArgumentValue,
): SuggesterOption<MBLiteral>[] {
	const options: SuggesterOption<MBLiteral>[] = [];

	for (const suggestOptionsArgument of optionArgs) {
		options.push(
			new SuggesterOption<MBLiteral>(suggestOptionsArgument.value, suggestOptionsArgument.name, `option`),
		);
	}

	if (optionQueryArgs.length > 0) {
		let dv: DataviewApi;
		try {
			dv = getDataViewPluginAPI(mb);
		} catch (e) {
			new Notice(
				'meta-bind | Dataview needs to be installed and enabled to use suggest option queries. Check the console for more information.',
			);
			console.warn('meta-bind | failed to get dataview api', e);

			return options;
		}

		const fileValidator = z.object({
			name: z.string().min(1),
			path: z.string().min(1),
		});

		for (const suggestOptionsQueryArgument of optionQueryArgs) {
			const result: DataArray<Record<string, Literal>> = dv.pages(suggestOptionsQueryArgument.value, filePath);

			result.forEach((file: Record<string, Literal>) => {
				try {
					const dvFile = file.file as { name: string; path: string };

					if (!fileValidator.safeParse(dvFile).success) {
						return;
					}

					const link = applyUseLinksArgument(dvFile.path, dvFile.name, useLinks);
					options.push(new SuggesterOption<MBLiteral>(link, dvFile.name, `file: ${dvFile.path}`));
				} catch (e) {
					console.warn('meta-bind | error while computing suggest options', e);
				}
			});
		}
	}

	options.push(...mb.optionSourceResolver.resolveToSuggesterOptions(mb, optionSourceArgs, useLinks));

	return deduplicateOptions(options);
}

export function getSuggesterOptionsForInputField(
	mb: ObsMetaBind,
	inputField: SuggesterLikeIFP,
): SuggesterOption<MBLiteral>[] {
	const optionArgs = inputField.mountable.getArguments(InputFieldArgumentType.OPTION);
	const optionQueryArgs = inputField.mountable.getArguments(InputFieldArgumentType.OPTION_QUERY);
	const optionSourceArgs = inputField.mountable.getArguments(InputFieldArgumentType.OPTION_SOURCE);
	const useLinksArg = inputField.mountable.getArgument(InputFieldArgumentType.USE_LINKS);
	// in not present, we treat the use links argument as true
	return getSuggesterOptions(
		mb,
		inputField.mountable.getFilePath(),
		optionArgs,
		optionQueryArgs,
		optionSourceArgs,
		useLinksArg === undefined ? UseLinksInputFieldArgumentValue.TRUE : useLinksArg.value,
	);
}
