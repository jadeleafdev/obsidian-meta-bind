import * as JsEngine from '@lemons_dev/obsidian-js-engine-api';

declare module '@lemons_dev/obsidian-js-engine-api' {
	export interface JsEngineApi {
		reactive(fn: JsFunc, ...initialArgs: unknown[]): ReactiveComponent;
	}

	export interface ReactiveComponent {
		refresh(...args: unknown[]): Promise<void>;
	}
}
