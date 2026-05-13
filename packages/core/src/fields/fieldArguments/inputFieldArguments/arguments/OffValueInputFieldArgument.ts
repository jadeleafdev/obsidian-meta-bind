import type { InputFieldArgumentConfig } from 'meta-bind-core/src/config/FieldConfigs';
import { InputFieldArgumentConfigs } from 'meta-bind-core/src/config/FieldConfigs';
import { AbstractInputFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/AbstractInputFieldArgument';
import type { ParsingResultNode } from 'meta-bind-core/src/parsers/nomParsers/GeneralNomParsers';
import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';
import { parseLiteral } from 'meta-bind-core/src/utils/Literal';

export class OffValueInputFieldArgument extends AbstractInputFieldArgument {
	value: MBLiteral = false;

	_parseValue(value: ParsingResultNode[]): void {
		this.value = parseLiteral(value[0].value);
	}

	public getConfig(): InputFieldArgumentConfig {
		return InputFieldArgumentConfigs.offValue;
	}
}
