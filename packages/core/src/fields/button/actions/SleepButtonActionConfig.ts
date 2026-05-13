import type { MetaBind } from 'meta-bind-core/src';
import type {
	ButtonClickContext,
	ButtonConfig,
	ButtonContext,
	SleepButtonAction,
} from 'meta-bind-core/src/config/ButtonConfig';
import { ButtonActionType } from 'meta-bind-core/src/config/ButtonConfig';
import { AbstractButtonActionConfig } from 'meta-bind-core/src/fields/button/AbstractButtonActionConfig';

export class SleepButtonActionConfig extends AbstractButtonActionConfig<SleepButtonAction> {
	constructor(mb: MetaBind) {
		super(ButtonActionType.SLEEP, mb);
	}

	async run(
		_config: ButtonConfig | undefined,
		action: SleepButtonAction,
		_filePath: string,
		_context: ButtonContext,
		_click: ButtonClickContext,
	): Promise<void> {
		await new Promise(resolve => window.setTimeout(resolve, action.ms));
	}

	create(): Required<SleepButtonAction> {
		return { type: ButtonActionType.SLEEP, ms: 0 };
	}

	getActionLabel(): string {
		return 'Sleep for some time';
	}
}
