import type { JsEngineApi, JsEnginePlugin } from '@lemons_dev/obsidian-js-engine-api';
import type { Templater, TemplaterPlugin } from 'meta-bind-obsidian/extraTypes/Templater';
import type { ObsMetaBind } from 'meta-bind-obsidian/src/ObsMB';
import type { Plugin } from 'obsidian';
import type { DataviewApi } from 'obsidian-dataview';

export function getDataViewPluginAPI(mb: ObsMetaBind): DataviewApi {
	const dataViewPlugin = mb.dependencyManager.checkDependency('dataview');
	return (dataViewPlugin as Plugin & { api: DataviewApi }).api;
}

export function getJsEnginePluginAPI(mb: ObsMetaBind): JsEngineApi {
	const jsEnginePlugin = mb.dependencyManager.checkDependency('js-engine');
	return (jsEnginePlugin as JsEnginePlugin).api;
}

export enum Templater_RunMode {
	CreateNewFromTemplate,
	AppendActiveFile,
	OverwriteFile,
	OverwriteActiveFile,
	DynamicProcessor,
	StartupTemplate,
}

export function getTemplaterPluginAPI(mb: ObsMetaBind): Templater {
	const templaterPlugin = mb.dependencyManager.checkDependency('templater-obsidian');
	return (templaterPlugin as TemplaterPlugin).templater;
}
