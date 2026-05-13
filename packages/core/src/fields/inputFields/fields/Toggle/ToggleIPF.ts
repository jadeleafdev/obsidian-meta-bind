import { InputFieldArgumentType } from 'meta-bind-core/src/config/FieldConfigs';
import { AbstractInputField } from 'meta-bind-core/src/fields/inputFields/AbstractInputField';
import type { InputFieldMountable } from 'meta-bind-core/src/fields/inputFields/InputFieldMountable';
import type { InputFieldSvelteComponent } from 'meta-bind-core/src/fields/inputFields/InputFieldSvelteWrapper';
import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';
import { parseUnknownToLiteral } from 'meta-bind-core/src/utils/Literal';
import ToggleComponent from 'meta-bind-core/src/fields/inputFields/fields/Toggle/ToggleComponent.svelte';

export class ToggleIPF extends AbstractInputField<MBLiteral, boolean> {
	onValue: MBLiteral;
	offValue: MBLiteral;

	constructor(mountable: InputFieldMountable) {
		super(mountable);

		this.onValue = this.mountable.getArgument(InputFieldArgumentType.ON_VALUE)?.value ?? true;
		this.offValue = this.mountable.getArgument(InputFieldArgumentType.OFF_VALUE)?.value ?? false;
	}

	protected filterValue(value: unknown): MBLiteral | undefined {
		return value === this.onValue || value === this.offValue ? parseUnknownToLiteral(value) : undefined;
	}

	protected getFallbackDefaultValue(): boolean {
		return false;
	}

	protected getSvelteComponent(): InputFieldSvelteComponent<boolean> {
		// @ts-ignore
		return ToggleComponent;
	}

	protected rawReverseMapValue(value: MBLiteral): boolean | undefined {
		if (value === this.onValue) {
			return true;
		} else if (value === this.offValue) {
			return false;
		} else {
			return false;
		}
	}

	protected rawMapValue(value: boolean): MBLiteral {
		return value ? this.onValue : this.offValue;
	}
}
