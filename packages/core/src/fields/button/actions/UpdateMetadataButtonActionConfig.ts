import type { MetaBind } from 'meta-bind-core/src';
import type {
	ButtonClickContext,
	ButtonConfig,
	ButtonContext,
	UpdateMetadataButtonAction,
} from 'meta-bind-core/src/config/ButtonConfig';
import { ButtonActionType } from 'meta-bind-core/src/config/ButtonConfig';
import { AbstractButtonActionConfig } from 'meta-bind-core/src/fields/button/AbstractButtonActionConfig';
import { ErrorLevel, MetaBindJsError } from 'meta-bind-core/src/utils/errors/MetaBindErrors';
import { parseLiteral } from 'meta-bind-core/src/utils/Literal';

export class UpdateMetadataButtonActionConfig extends AbstractButtonActionConfig<UpdateMetadataButtonAction> {
	constructor(mb: MetaBind) {
		super(ButtonActionType.UPDATE_METADATA, mb);
	}

	async run(
		_config: ButtonConfig | undefined,
		action: UpdateMetadataButtonAction,
		filePath: string,
		_context: ButtonContext,
		_click: ButtonClickContext,
	): Promise<void> {
		const bindTarget = this.mb.bindTargetParser.fromStringAndValidate(action.bindTarget, filePath);

		if (action.evaluate) {
			if (!this.mb.getSettings().enableJs) {
				throw new MetaBindJsError({
					errorLevel: ErrorLevel.CRITICAL,
					effect: "Can't run button action that requires JS evaluation.",
					cause: 'JS evaluation is disabled in the plugin settings.',
				});
			}

			const value = this.mb.api.getMetadata(bindTarget);
			const newValue = await this.mb.internal.jsEngineExecuteCustom(
				action.value,
				{
					x: value,
					getMetadata: (bindTarget: string) =>
						this.mb.api.getMetadata(this.mb.api.parseBindTarget(bindTarget, filePath)),
				},
				true,
			);

			this.mb.api.setMetadata(bindTarget, newValue);
		} else {
			this.mb.api.setMetadata(bindTarget, parseLiteral(action.value));
		}
	}

	create(): Required<UpdateMetadataButtonAction> {
		return {
			type: ButtonActionType.UPDATE_METADATA,
			bindTarget: '',
			evaluate: false,
			value: '',
		};
	}

	getActionLabel(): string {
		return 'Update metadata';
	}
}
