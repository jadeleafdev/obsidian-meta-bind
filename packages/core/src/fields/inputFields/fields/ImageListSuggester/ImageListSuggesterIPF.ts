import { AbstractInputField } from 'meta-bind-core/src/fields/inputFields/AbstractInputField';
import type { InputFieldSvelteComponent } from 'meta-bind-core/src/fields/inputFields/InputFieldSvelteWrapper';
import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';
import { parseUnknownToLiteralArray, stringifyLiteral } from 'meta-bind-core/src/utils/Literal';
import ImageListSuggesterComponent from 'meta-bind-core/src/fields/inputFields/fields/ImageListSuggester/ImageListSuggesterComponent.svelte';

interface SvelteExports {
	pushValue: (value: MBLiteral) => void;
}

export class ImageListSuggesterIPF extends AbstractInputField<MBLiteral[], string[], SvelteExports> {
	protected filterValue(value: unknown): MBLiteral[] | undefined {
		return parseUnknownToLiteralArray(value);
	}

	protected getFallbackDefaultValue(): string[] {
		return [];
	}

	protected getSvelteComponent(): InputFieldSvelteComponent<string[], SvelteExports> {
		// @ts-ignore
		return ImageListSuggesterComponent;
	}

	protected rawMapValue(value: string[]): MBLiteral[] {
		return value;
	}

	protected rawReverseMapValue(value: MBLiteral[]): string[] | undefined {
		return value.map(v => stringifyLiteral(v)).filter(v => v !== undefined);
	}

	protected getMountArgs(): Record<string, unknown> {
		return {
			showSuggester: () => this.openModal(),
		};
	}

	openModal(): void {
		this.mountable.mb.internal.openImageSuggesterModal(this, false, (selected: string | undefined) => {
			if (selected !== undefined) {
				this.svelteWrapper?.getInstance()?.pushValue(selected);
			}
		});
	}
}
