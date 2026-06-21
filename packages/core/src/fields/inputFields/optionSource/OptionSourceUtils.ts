import type { MBLiteral } from 'meta-bind-core/src/utils/Literal';
import { stringifyLiteral } from 'meta-bind-core/src/utils/Literal';

export function deduplicateOptions<T extends { value: MBLiteral }>(options: T[]): T[] {
	const seen = new Set<string>();
	const deduplicated: T[] = [];

	for (const option of options) {
		const value = stringifyLiteral(option.value);
		if (seen.has(value)) {
			continue;
		}
		seen.add(value);
		deduplicated.push(option);
	}

	return deduplicated;
}

export function pathIsOrIsInside(path: string, folder: string): boolean {
	const normalizedFolder = folder.replace(/\/$/, '');
	if (normalizedFolder === '') {
		return true;
	}
	return path === normalizedFolder || path.startsWith(`${normalizedFolder}/`);
}

export function normalizeTag(tag: string): string {
	const trimmedTag = tag.trim();
	return trimmedTag.startsWith('#') ? trimmedTag : `#${trimmedTag}`;
}

export function getFileName(path: string): string {
	return path.split('/').at(-1) ?? path;
}
