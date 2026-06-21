import { InputFieldArgumentType } from 'meta-bind-core/src/config/FieldConfigs';
import { AbstractInputField } from 'meta-bind-core/src/fields/inputFields/AbstractInputField';
import type { InputFieldMountable } from 'meta-bind-core/src/fields/inputFields/InputFieldMountable';
import type { InputFieldSvelteComponent } from 'meta-bind-core/src/fields/inputFields/InputFieldSvelteWrapper';
import type { OptionSourceOption } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceTypes';
import { deduplicateOptions } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceUtils';
import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';
import { parseUnknownToLiteralArray } from 'meta-bind-core/src/utils/Literal';
import MultiSelectComponent from 'meta-bind-core/src/fields/inputFields/fields/MultiSelect/MultiSelectComponent.svelte';

export class MultiSelectIPF extends AbstractInputField<MBLiteral[], MBLiteral[]> {
	options: OptionSourceOption[];

	constructor(mountable: InputFieldMountable) {
		super(mountable);

		const optionArgs = this.mountable.getArguments(InputFieldArgumentType.OPTION);
		const optionSourceArgs = this.mountable.getArguments(InputFieldArgumentType.OPTION_SOURCE);
		if (optionSourceArgs.length > 0) {
			this.options = deduplicateOptions([
				...optionArgs,
				...this.mountable.mb.optionSourceResolver.resolve(this.mountable.mb, optionSourceArgs),
			]);
		} else {
			this.options = optionArgs;
		}
	}

	protected filterValue(value: unknown): MBLiteral[] | undefined {
		return parseUnknownToLiteralArray(value);
	}

	protected getFallbackDefaultValue(): MBLiteral[] {
		return [];
	}

	protected getSvelteComponent(): InputFieldSvelteComponent<MBLiteral[]> {
		// @ts-ignore
		return MultiSelectComponent;
	}

	protected rawMapValue(value: MBLiteral[]): MBLiteral[] {
		return value;
	}

	protected rawReverseMapValue(value: MBLiteral[]): MBLiteral[] | undefined {
		return value;
	}

	protected getMountArgs(): Record<string, unknown> {
		return {
			options: this.options,
		};
	}
}
