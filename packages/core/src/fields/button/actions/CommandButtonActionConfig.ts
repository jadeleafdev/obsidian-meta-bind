import type { MetaBind } from 'meta-bind-core/src';
import type {
	ButtonClickContext,
	ButtonConfig,
	ButtonContext,
	CommandButtonAction,
} from 'meta-bind-core/src/config/ButtonConfig';
import { ButtonActionType } from 'meta-bind-core/src/config/ButtonConfig';
import { AbstractButtonActionConfig } from 'meta-bind-core/src/fields/button/AbstractButtonActionConfig';

export class CommandButtonActionConfig extends AbstractButtonActionConfig<CommandButtonAction> {
	constructor(mb: MetaBind) {
		super(ButtonActionType.COMMAND, mb);
	}

	async run(
		_config: ButtonConfig | undefined,
		action: CommandButtonAction,
		_filePath: string,
		_context: ButtonContext,
		_click: ButtonClickContext,
	): Promise<void> {
		this.mb.internal.executeCommandById(action.command);
	}

	create(): Required<CommandButtonAction> {
		return { type: ButtonActionType.COMMAND, command: '' };
	}

	getActionLabel(): string {
		return 'Run a command';
	}
}
