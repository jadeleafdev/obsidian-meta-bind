import { FileAPI } from 'meta-bind-core/src/api/FileAPI';
import { TestFileSystem } from './TestFileSystem';
import type { TestComponents, TestMetaBind } from './TestPlugin';

export class TestFileAPI extends FileAPI<TestComponents> {
	fileSystem: TestFileSystem;
	fileTags: Map<string, string[]>;

	constructor(mb: TestMetaBind) {
		super(mb);

		this.fileSystem = new TestFileSystem();
		this.fileTags = new Map();
	}

	public read(filePath: string): Promise<string> {
		return Promise.resolve(this.fileSystem.readFile(filePath));
	}

	public write(filePath: string, content: string): Promise<void> {
		this.fileSystem.writeFile(filePath, content);
		return Promise.resolve();
	}

	public exists(filePath: string): Promise<boolean> {
		return Promise.resolve(this.fileSystem.fileExists(filePath));
	}

	public atomicModify(filePath: string, modify: (content: string) => string): Promise<void> {
		const content = this.fileSystem.readFile(filePath);
		const newContent = modify(content);
		this.fileSystem.writeFile(filePath, newContent);
		return Promise.resolve();
	}

	public create(folderPath: string, fileName: string, extension: string, open?: boolean): Promise<string> {
		let filePath = `${folderPath}/${fileName}.${extension}`;
		if (filePath.startsWith('/')) {
			filePath = filePath.slice(1);
		}
		this.fileSystem.writeFile(filePath, '');
		return Promise.resolve(filePath);
	}

	public getAllFiles(): string[] {
		return this.fileSystem.listFiles();
	}

	public getAllFolders(): string[] {
		return this.fileSystem.listDirs();
	}

	public getAllTags(): string[] {
		return Array.from(new Set(Array.from(this.fileTags.values()).flat()));
	}

	public getFileTags(filePath: string): string[] {
		return this.fileTags.get(filePath) ?? [];
	}

	public setFileTags(filePath: string, tags: string[]): void {
		this.fileTags.set(filePath, tags);
	}

	public open(_filePath: string, _callingFilePath: string, _newTab: boolean): Promise<void> {
		return Promise.resolve();
	}

	public getPathByName(name: string, _relativeTo?: string): string | undefined {
		return name;
	}
}
