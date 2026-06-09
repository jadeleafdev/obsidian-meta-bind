import type { MetaBindDate } from 'meta-bind-core/src/api/MetaBindDate';
import { InputFieldArgumentType } from 'meta-bind-core/src/config/FieldConfigs';
import type { OptionInputFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/arguments/OptionInputFieldArgument';
import { AbstractInputField } from 'meta-bind-core/src/fields/inputFields/AbstractInputField';
import type { InputFieldMountable } from 'meta-bind-core/src/fields/inputFields/InputFieldMountable';
import type { InputFieldSvelteComponent } from 'meta-bind-core/src/fields/inputFields/InputFieldSvelteWrapper';
import DatePickerComponent from 'meta-bind-core/src/fields/inputFields/fields/DatePicker/DatePickerComponent.svelte';

export class DatePickerIPF extends AbstractInputField<string | null, MetaBindDate | null> {
	options: OptionInputFieldArgument[];

	constructor(mountable: InputFieldMountable) {
		super(mountable);

		this.options = this.mountable.getArguments(InputFieldArgumentType.OPTION);
	}

	protected filterValue(value: unknown): string | null | undefined {
		if (value === null) {
			return null;
		}
		if (value === undefined || typeof value !== 'string') {
			return undefined;
		}
		const date = this.mountable.mb.dateParser.parse(value);
		if (date.isValid()) {
			return this.mountable.mb.dateParser.stringify(date);
		} else {
			return undefined;
		}
	}

	protected getFallbackDefaultValue(): MetaBindDate {
		return this.mountable.mb.dateParser.getDefaultDate();
	}

	protected getSvelteComponent(): InputFieldSvelteComponent<MetaBindDate | null> {
		// @ts-ignore
		return DatePickerComponent;
	}

	protected rawMapValue(value: MetaBindDate | null): string | null {
		if (value === null) {
			return null;
		}

		return this.mountable.mb.dateParser.stringify(value);
	}

	protected rawReverseMapValue(value: string | null): MetaBindDate | null | undefined {
		if (value === null) {
			return null;
		}
		const date = this.mountable.mb.dateParser.parse(value);
		if (date.isValid()) {
			return date;
		} else {
			return undefined;
		}
	}

	protected getMountArgs(): Record<string, unknown> {
		return {
			dateFormat: this.mountable.mb.getSettings().preferredDateFormat,
			showDatePicker: (): void => {
				this.mountable.mb.internal.openDatePickerModal(this.getInternalValue(), (value: MetaBindDate | null) =>
					this.setInternalValue(value),
				);
			},
		};
	}
}
