import { AbstractInputField } from 'meta-bind-core/src/fields/inputFields/AbstractInputField';
import type { InputFieldSvelteComponent } from 'meta-bind-core/src/fields/inputFields/InputFieldSvelteWrapper';
import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';
import { isLiteral, stringifyLiteral } from 'meta-bind-core/src/utils/Literal';
import ImageSuggesterComponent from 'meta-bind-core/src/fields/inputFields/fields/ImageSuggester/ImageSuggesterComponent.svelte';

export class ImageSuggesterIPF extends AbstractInputField<MBLiteral, string | undefined> {
	protected filterValue(value: unknown): MBLiteral | undefined {
		return isLiteral(value) ? value : undefined;
	}

	protected getFallbackDefaultValue(): string | undefined {
		return undefined;
	}

	protected getSvelteComponent(): InputFieldSvelteComponent<string | undefined> {
		// @ts-ignore
		return ImageSuggesterComponent;
	}

	protected rawMapValue(value: string): MBLiteral {
		return value;
	}

	protected rawReverseMapValue(value: MBLiteral): string | undefined {
		return stringifyLiteral(value);
	}

	protected getMountArgs(): Record<string, unknown> {
		return {
			showSuggester: () => this.openModal(),
			clear: () => this.setInternalValue(undefined),
		};
	}

	openModal(): void {
		this.mountable.mb.internal.openImageSuggesterModal(this, true, (selected: string | undefined) =>
			this.setInternalValue(selected),
		);
	}
}
