import { type Command, InternalAPI, type ModalOptions } from 'meta-bind-core/src/api/InternalAPI';
import { ImageSuggesterIPF } from 'meta-bind-core/src/fields/inputFields/fields/ImageSuggester/ImageSuggesterIPF';
import {
	type SuggesterLikeIFP,
	SuggesterOption,
} from 'meta-bind-core/src/fields/inputFields/fields/Suggester/SuggesterHelper';
import type { IJsRenderer } from 'meta-bind-core/src/utils/IJsRenderer';
import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';
import { TestMetaBind, type TestComponents } from './TestPlugin';
import type { IFuzzySearch } from 'meta-bind-core/src/utils/IFuzzySearch';
import type { MetaBindDate } from 'meta-bind-core/src/api/MetaBindDate';
import { ModalContent } from 'meta-bind-core/src/modals/ModalContent';
import type { IModal } from 'meta-bind-core/src/modals/IModal';
import { SelectModalContent } from 'meta-bind-core/src/modals/SelectModalContent';
import type { ContextMenuItemDefinition, IContextMenu } from 'meta-bind-core/src/utils/IContextMenu';
import YAML from 'yaml';
import { z, ZodType } from 'zod';
import type { LifecycleHook } from 'meta-bind-core/src/api/API';
import { zodFunction } from 'meta-bind-core/src/utils/ZodUtils';
import moment from 'moment';

export class TestInternalAPI extends InternalAPI<TestComponents> {
	constructor(mb: TestMetaBind) {
		super(mb);
	}

	public getLifecycleHookValidator(): ZodType<LifecycleHook, any, any> {
		return z.object({ register: zodFunction() });
	}

	public async renderMarkdown(markdown: string, element: HTMLElement, _filePath: string): Promise<() => void> {
		element.innerText += markdown;
		return () => {};
	}

	public executeCommandById(_id: string): boolean {
		return true;
	}

	public isJsEngineAvailable(): boolean {
		return false;
	}

	public jsEngineRunFile(
		_filePath: string,
		_callingFilePath: string,
		_contextOverrides: Record<string, unknown>,
		_container?: HTMLElement,
	): Promise<() => void> {
		return Promise.resolve(() => {});
	}

	public jsEngineRunCode(
		_code: string,
		_callingFilePath: string,
		_contextOverrides: Record<string, unknown>,
		_container?: HTMLElement,
	): Promise<() => void> {
		return Promise.resolve(() => {});
	}

	public jsEngineExecuteCustom(
		_code: string,
		_globals: Record<string, unknown>,
		_expression?: boolean,
	): Promise<unknown> {
		return Promise.resolve(undefined);
	}

	public createJsRenderer(_container: HTMLElement, _filePath: string, _code: string, _hidden: boolean): IJsRenderer {
		throw new Error('not implemented');
	}

	public showNotice(_: string): void {}

	public parseYaml(yaml: string): unknown {
		return YAML.parse(yaml) as unknown;
	}

	public stringifyYaml(yaml: unknown): string {
		return YAML.stringify(yaml);
	}

	public setIcon(_element: HTMLElement, _icon: string): void {}

	public imagePathToUri(imagePath: string): string {
		return imagePath;
	}

	public createFuzzySearch(): IFuzzySearch {
		throw new Error('not implemented');
	}

	public createModal(_content: ModalContent, _options: ModalOptions | undefined): IModal {
		throw new Error('not implemented');
	}

	public createSearchModal<T>(_content: SelectModalContent<T>): IModal {
		throw new Error('not implemented');
	}

	public getAllCommands(): Command[] {
		return [];
	}

	public getImageSuggesterOptions(_inputField: ImageSuggesterIPF): SuggesterOption<string>[] {
		return [];
	}

	public getSuggesterOptions(_inputField: SuggesterLikeIFP): SuggesterOption<MBLiteral>[] {
		return [];
	}

	public createContextMenu(_items: ContextMenuItemDefinition[]): IContextMenu {
		throw new Error('not implemented');
	}

	public createDate(input?: string | Date, format?: string): MetaBindDate {
		return moment(input, format);
	}

	public evaluateTemplaterTemplate(_templateFilePath: string, _targetFilePath: string): Promise<string> {
		return Promise.resolve('');
	}

	public async createNoteWithTemplater(
		_templateFilePath: string,
		folderPath?: string,
		fileName?: string,
		openNote?: boolean,
	): Promise<string | undefined> {
		return await this.mb.file.create(folderPath ?? '', fileName ?? 'unnamed', 'md', openNote);
	}
}
