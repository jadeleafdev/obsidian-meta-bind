import type { Parser } from '@lemons_dev/parsinom';
import { P, P_UTILS } from '@lemons_dev/parsinom';
import type {
	OptionSourceFilter,
	OptionSourceQuery,
} from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceTypes';
import {
	P_DoubleQuotedString,
	P_Ident,
	P_SingleQuotedString,
} from 'meta-bind-core/src/parsers/nomParsers/GeneralNomParsers';
import { ErrorLevel, MetaBindArgumentError } from 'meta-bind-core/src/utils/errors/MetaBindErrors';

const P_BareOptionSourceValue: Parser<string> = P.regexp(/^[^\s'"]+/).describe('unquoted option source value');
const P_OptionSourceFilter: Parser<OptionSourceFilter> = P.sequenceMap(
	(name, value): OptionSourceFilter => ({ name, value }),
	P_Ident,
	P.string(':').then(P.or(P_SingleQuotedString, P_DoubleQuotedString, P_BareOptionSourceValue)),
);
const P_OptionSourceQuery: Parser<OptionSourceQuery> = P.sequenceMap(
	(sourceType, filters): OptionSourceQuery => ({ sourceType, filters }),
	P_Ident,
	P_UTILS.whitespace().then(P_OptionSourceFilter).many(),
);

export function parseOptionSourceQuery(queryString: string): OptionSourceQuery {
	const parseResult = P_OptionSourceQuery.thenEof().tryParse(queryString);
	if (!parseResult.success) {
		throw new MetaBindArgumentError({
			errorLevel: ErrorLevel.WARNING,
			effect: 'failed to parse option source',
			cause: `invalid option source query '${queryString}'`,
		});
	}
	return parseResult.value;
}
