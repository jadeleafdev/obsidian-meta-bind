import type {
	ViewFieldArgumentConfig,
	ViewFieldArgumentType,
	ViewFieldType,
} from 'meta-bind-core/src/config/FieldConfigs';
import { AbstractFieldArgumentContainer } from 'meta-bind-core/src/fields/fieldArguments/AbstractFieldArgumentContainer';
import type { ViewFieldArgumentMapType } from 'meta-bind-core/src/fields/fieldArguments/viewFieldArguments/ViewFieldArgumentFactory';

export class ViewFieldArgumentContainer extends AbstractFieldArgumentContainer<
	ViewFieldType,
	ViewFieldArgumentType,
	ViewFieldArgumentConfig
> {
	getAll<T extends ViewFieldArgumentType>(name: T): NonNullable<ViewFieldArgumentMapType<T>>[] {
		// @ts-ignore
		return super.getAll(name);
	}

	get<T extends ViewFieldArgumentType>(name: T): ViewFieldArgumentMapType<T> | undefined {
		return this.getAll(name).at(0);
	}
}
