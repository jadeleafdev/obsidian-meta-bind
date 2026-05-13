import type { InputFieldArgumentConfig } from 'meta-bind-core/src/config/FieldConfigs';
import { InputFieldArgumentConfigs } from 'meta-bind-core/src/config/FieldConfigs';
import { AbstractInputFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/AbstractInputFieldArgument';
import type { ParsingResultNode } from 'meta-bind-core/src/parsers/nomParsers/GeneralNomParsers';

export class ClassInputFieldArgument extends AbstractInputFieldArgument {
	value: string[] = [];

	_parseValue(value: ParsingResultNode[]): void {
		this.value = value[0].value.split(' ');
	}

	public getConfig(): InputFieldArgumentConfig {
		return InputFieldArgumentConfigs.class;
	}
}
