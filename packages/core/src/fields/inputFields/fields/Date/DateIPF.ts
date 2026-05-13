import { AbstractInputField } from 'meta-bind-core/src/fields/inputFields/AbstractInputField';
import type { InputFieldSvelteComponent } from 'meta-bind-core/src/fields/inputFields/InputFieldSvelteWrapper';
import { DateParser } from 'meta-bind-core/src/parsers/DateParser';
import { parseUnknownToString } from 'meta-bind-core/src/utils/Literal';
import DateComponent from 'meta-bind-core/src/fields/inputFields/fields/Date/DateComponent.svelte';

export class DateIPF extends AbstractInputField<string, string> {
	protected filterValue(value: unknown): string | undefined {
		return parseUnknownToString(value);
	}

	protected getFallbackDefaultValue(): string {
		return DateParser.stringify(DateParser.getDefaultDate());
	}

	protected getSvelteComponent(): InputFieldSvelteComponent<string> {
		// @ts-ignore
		return DateComponent;
	}

	protected rawMapValue(value: string): string {
		return value;
	}

	protected rawReverseMapValue(value: string): string | undefined {
		return value;
	}
}
