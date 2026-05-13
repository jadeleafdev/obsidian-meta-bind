import type { MetaBind } from 'meta-bind-core/src';
import type {
	ButtonClickContext,
	ButtonConfig,
	ButtonContext,
	RunTemplaterFileButtonAction,
} from 'meta-bind-core/src/config/ButtonConfig';
import { ButtonActionType } from 'meta-bind-core/src/config/ButtonConfig';
import { AbstractButtonActionConfig } from 'meta-bind-core/src/fields/button/AbstractButtonActionConfig';

export class RunTemplaterFileButtonActionConfig extends AbstractButtonActionConfig<RunTemplaterFileButtonAction> {
	constructor(mb: MetaBind) {
		super(ButtonActionType.RUN_TEMPLATER_FILE, mb);
	}

	async run(
		_config: ButtonConfig | undefined,
		action: RunTemplaterFileButtonAction,
		filePath: string,
		_context: ButtonContext,
		_click: ButtonClickContext,
	): Promise<void> {
		const templateFilePath = this.mb.file.resolveFilePathLike(action.templateFile);
		void (await this.mb.internal.evaluateTemplaterTemplate(templateFilePath, filePath));
	}

	create(): Required<RunTemplaterFileButtonAction> {
		return {
			type: ButtonActionType.RUN_TEMPLATER_FILE,
			templateFile: '',
		};
	}

	getActionLabel(): string {
		return 'Run a templater file';
	}
}
