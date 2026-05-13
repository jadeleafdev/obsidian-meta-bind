import { InputFieldArgumentType } from 'meta-bind-core/src/config/FieldConfigs';
import { AbstractInputField } from 'meta-bind-core/src/fields/inputFields/AbstractInputField';
import type { InputFieldSvelteComponent } from 'meta-bind-core/src/fields/inputFields/InputFieldSvelteWrapper';
import { parseUnknownToFloat } from 'meta-bind-core/src/utils/Literal';
import NumberComponent from 'meta-bind-core/src/fields/inputFields/fields/Number/NumberComponent.svelte';

export class NumberIPF extends AbstractInputField<number | null, number | null> {
	protected filterValue(value: unknown): number | null | undefined {
		return parseUnknownToFloat(value);
	}

	protected getFallbackDefaultValue(): number | null {
		return null;
	}

	protected getSvelteComponent(): InputFieldSvelteComponent<number | null> {
		// @ts-ignore
		return NumberComponent;
	}

	protected rawReverseMapValue(value: number | null): number | null | undefined {
		return value;
	}

	protected rawMapValue(value: number | null): number | null {
		return value;
	}

	protected getMountArgs(): Record<string, unknown> {
		return {
			placeholder: this.mountable.getArgument(InputFieldArgumentType.PLACEHOLDER)?.value ?? 'Number',
		};
	}
}
