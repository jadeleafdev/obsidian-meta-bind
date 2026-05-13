import type { MetaBind } from 'meta-bind-core/src';
import type {
	ButtonClickContext,
	ButtonConfig,
	ButtonContext,
	InputButtonAction,
} from 'meta-bind-core/src/config/ButtonConfig';
import { ButtonActionType } from 'meta-bind-core/src/config/ButtonConfig';
import { AbstractButtonActionConfig } from 'meta-bind-core/src/fields/button/AbstractButtonActionConfig';

export class InputButtonActionConfig extends AbstractButtonActionConfig<InputButtonAction> {
	constructor(mb: MetaBind) {
		super(ButtonActionType.INPUT, mb);
	}

	async run(
		_config: ButtonConfig | undefined,
		action: InputButtonAction,
		_filePath: string,
		_context: ButtonContext,
		_click: ButtonClickContext,
	): Promise<void> {
		const el = document.activeElement;
		if (el && el instanceof HTMLInputElement) {
			el.setRangeText(action.str, el.selectionStart!, el.selectionEnd!, 'end');
			el.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}

	create(): Required<InputButtonAction> {
		return { type: ButtonActionType.INPUT, str: '' };
	}

	getActionLabel(): string {
		return 'Insert text at cursor';
	}
}
