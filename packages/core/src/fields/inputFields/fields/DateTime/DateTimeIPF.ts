import { AbstractInputField } from 'meta-bind-core/src/fields/inputFields/AbstractInputField';
import type { InputFieldSvelteComponent } from 'meta-bind-core/src/fields/inputFields/InputFieldSvelteWrapper';
import { parseUnknownToString } from 'meta-bind-core/src/utils/Literal';
import DateTimeComponent from 'meta-bind-core/src/fields/inputFields/fields/DateTime/DateTimeComponent.svelte';

export class DateTimeIPF extends AbstractInputField<string, string> {
	protected filterValue(value: unknown): string | undefined {
		return parseUnknownToString(value);
	}

	protected getFallbackDefaultValue(): string {
		return this.mountable.mb.dateParser.stringify(this.mountable.mb.dateParser.getDefaultDate());
	}

	protected getSvelteComponent(): InputFieldSvelteComponent<string> {
		// @ts-ignore
		return DateTimeComponent;
	}

	protected rawMapValue(value: string): string {
		return value;
	}

	protected rawReverseMapValue(value: string): string | undefined {
		return value;
	}
}
