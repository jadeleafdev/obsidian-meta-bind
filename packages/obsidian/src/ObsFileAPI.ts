import { FileAPI } from 'meta-bind-core/src/api/FileAPI';
import { normalizeTag } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceUtils';
import type { ObsComponents, ObsMetaBind } from 'meta-bind-obsidian/src/ObsMB';
import type { App } from 'obsidian';
import { normalizePath, TFile, TFolder } from 'obsidian';

export class ObsFileAPI extends FileAPI<ObsComponents> {
	readonly app: App;

	constructor(mb: ObsMetaBind) {
		super(mb);
		this.app = mb.app;
	}

	public async read(filePath: string): Promise<string> {
		const tFile = this.app.vault.getAbstractFileByPath(filePath);
		if (!tFile || !(tFile instanceof TFile)) {
			throw new Error(`file not found: ${filePath}`);
		}

		return this.app.vault.cachedRead(tFile);
	}

	public async write(filePath: string, content: string): Promise<void> {
		const tFile = this.app.vault.getFileByPath(filePath);
		if (!tFile) {
			throw new Error(`file not found: ${filePath}`);
		}
		await this.app.vault.modify(tFile, content);
	}

	public async exists(filePath: string): Promise<boolean> {
		return this.app.vault.getFileByPath(filePath) !== null;
	}

	public async atomicModify(filePath: string, modify: (content: string) => string): Promise<void> {
		const tFile = this.app.vault.getFileByPath(filePath);
		if (!tFile) {
			throw new Error(`file not found: ${filePath}`);
		}

		await this.app.vault.process(tFile, content => modify(content));
	}

	public async create(
		folderPath: string,
		fileName: string,
		extension: string,
		open: boolean = false,
		newTab: boolean = false,
	): Promise<string> {
		const path = this.app.vault.getAvailablePath(normalizePath(folderPath + '/' + fileName), extension);
		const newFile = await this.app.vault.create(path, '');

		if (open) {
			await this.openInSourceMode(newFile, newTab);
		}

		return newFile.path;
	}

	public getAllFiles(): string[] {
		return this.app.vault
			.getAllLoadedFiles()
			.filter(file => file instanceof TFile)
			.map(file => file.path);
	}

	public getAllFolders(): string[] {
		return this.app.vault
			.getAllLoadedFiles()
			.filter(file => file instanceof TFolder)
			.map(file => file.path);
	}

	public getAllTags(): string[] {
		const tags = new Set<string>();

		for (const filePath of this.getAllFiles()) {
			for (const tag of this.getFileTags(filePath)) {
				tags.add(tag);
			}
		}

		return Array.from(tags);
	}

	public getFileTags(filePath: string): string[] {
		const file = this.app.vault.getFileByPath(filePath);
		if (!file) {
			return [];
		}

		const cache = this.app.metadataCache.getFileCache(file);
		const tags = new Set<string>();

		for (const tagCache of cache?.tags ?? []) {
			tags.add(normalizeTag(tagCache.tag));
		}

		const frontmatter = cache?.frontmatter;
		this.addFrontmatterTags(frontmatter?.tag, tags);
		this.addFrontmatterTags(frontmatter?.tags, tags);

		return Array.from(tags);
	}

	public async open(filePath: string, callingFilePath: string, newTab: boolean): Promise<void> {
		void this.app.workspace.openLinkText(filePath, callingFilePath, newTab);
	}

	public async openInSourceMode(file: TFile, newTab: boolean): Promise<void> {
		const activeLeaf = this.app.workspace.getLeaf(newTab ? 'tab' : false);
		if (activeLeaf) {
			await activeLeaf.openFile(file, {
				state: { mode: 'source' },
			});
		}
	}

	public getPathByName(name: string, relativeTo: string = ''): string | undefined {
		return this.app.metadataCache.getFirstLinkpathDest(name, relativeTo)?.path;
	}

	private addFrontmatterTags(value: unknown, tags: Set<string>): void {
		if (typeof value === 'string') {
			for (const tag of value.split(',').map(tag => tag.trim())) {
				if (tag.length > 0) {
					tags.add(normalizeTag(tag));
				}
			}
		} else if (Array.isArray(value)) {
			for (const tag of value) {
				this.addFrontmatterTags(tag, tags);
			}
		}
	}
}
