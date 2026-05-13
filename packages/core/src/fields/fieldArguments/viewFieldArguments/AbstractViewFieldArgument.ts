import type {
	ViewFieldArgumentConfig,
	ViewFieldArgumentType,
	ViewFieldType,
} from 'meta-bind-core/src/config/FieldConfigs';
import { AbstractFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/AbstractFieldArgument';

export abstract class AbstractViewFieldArgument extends AbstractFieldArgument<
	ViewFieldType,
	ViewFieldArgumentType,
	ViewFieldArgumentConfig
> {}
