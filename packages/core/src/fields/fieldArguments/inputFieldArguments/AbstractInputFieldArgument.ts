import type {
	InputFieldArgumentConfig,
	InputFieldArgumentType,
	InputFieldType,
} from 'meta-bind-core/src/config/FieldConfigs';
import { AbstractFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/AbstractFieldArgument';

export abstract class AbstractInputFieldArgument extends AbstractFieldArgument<
	InputFieldType,
	InputFieldArgumentType,
	InputFieldArgumentConfig
> {}
