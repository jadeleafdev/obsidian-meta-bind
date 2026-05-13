import type { ViewFieldArgumentConfig } from 'meta-bind-core/src/config/FieldConfigs';
import { ViewFieldArgumentConfigs } from 'meta-bind-core/src/config/FieldConfigs';
import { AbstractViewFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/viewFieldArguments/AbstractViewFieldArgument';
import type { ParsingResultNode } from 'meta-bind-core/src/parsers/nomParsers/GeneralNomParsers';

export class HiddenViewFieldArgument extends AbstractViewFieldArgument {
	value: boolean = true;

	_parseValue(value: ParsingResultNode[]): void {
		this.value = value[0] === undefined || value[0]?.value.toLowerCase() === 'true';
	}

	public getConfig(): ViewFieldArgumentConfig {
		return ViewFieldArgumentConfigs.hidden;
	}
}
