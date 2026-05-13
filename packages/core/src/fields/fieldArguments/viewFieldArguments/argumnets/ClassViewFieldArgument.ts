import type { ViewFieldArgumentConfig } from 'meta-bind-core/src/config/FieldConfigs';
import { ViewFieldArgumentConfigs } from 'meta-bind-core/src/config/FieldConfigs';
import { AbstractViewFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/viewFieldArguments/AbstractViewFieldArgument';
import type { ParsingResultNode } from 'meta-bind-core/src/parsers/nomParsers/GeneralNomParsers';

export class ClassViewFieldArgument extends AbstractViewFieldArgument {
	value: string[] = [];

	_parseValue(value: ParsingResultNode[]): void {
		this.value = value[0].value.split(' ');
	}

	public getConfig(): ViewFieldArgumentConfig {
		return ViewFieldArgumentConfigs.class;
	}
}
