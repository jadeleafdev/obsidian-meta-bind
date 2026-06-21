import { describe, expect, test } from 'bun:test';
import { OptionSourceInputFieldArgument } from 'meta-bind-core/src/fields/fieldArguments/inputFieldArguments/arguments/OptionSourceInputFieldArgument';
import { OptionSourceResolver } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceResolver';
import { deduplicateOptions } from 'meta-bind-core/src/fields/inputFields/optionSource/OptionSourceUtils';
import { TestMetaBind } from '../__mocks__/TestPlugin';

function optionSource(query: string): OptionSourceInputFieldArgument {
	const arg = new OptionSourceInputFieldArgument();
	arg.parseValue([{ value: query }]);
	return arg;
}

function createTestMetaBind(): TestMetaBind {
	const mb = new TestMetaBind();
	mb.file.fileSystem.writeFile('Projects/Alpha.md', '');
	mb.file.fileSystem.writeFile('Projects/Foo Bar/Beta.md', '');
	mb.file.fileSystem.writeFile('Projects/image.png', '');
	mb.file.fileSystem.writeFile('People/Ada.md', '');
	mb.file.setFileTags('Projects/Alpha.md', ['#project', '#include/me/A']);
	mb.file.setFileTags('People/Ada.md', ['#person', '#include/me/B']);
	return mb;
}

describe('OptionSourceResolver', () => {
	test('resolves all files', () => {
		const mb = createTestMetaBind();
		const resolver = new OptionSourceResolver();

		const options = resolver.resolve(mb, [optionSource('file')]);

		expect(options.map(option => option.value)).toEqual([
			'Projects/Alpha.md',
			'Projects/Foo Bar/Beta.md',
			'Projects/image.png',
			'People/Ada.md',
		]);
	});

	test('filters files by folder and extension', () => {
		const mb = createTestMetaBind();
		const resolver = new OptionSourceResolver();

		const options = resolver.resolve(mb, [optionSource('file from:Projects ext:md')]);

		expect(options.map(option => option.value)).toEqual(['Projects/Alpha.md', 'Projects/Foo Bar/Beta.md']);
	});

	test('treats empty from filters as the root folder', () => {
		const mb = createTestMetaBind();
		const resolver = new OptionSourceResolver();

		const options = resolver.resolve(mb, [optionSource('file from:"" ext:md')]);

		expect(options.map(option => option.value)).toEqual([
			'Projects/Alpha.md',
			'Projects/Foo Bar/Beta.md',
			'People/Ada.md',
		]);
	});

	test('parses quoted filter values', () => {
		const mb = createTestMetaBind();
		const resolver = new OptionSourceResolver();

		const options = resolver.resolve(mb, [optionSource('file from:"Projects/Foo Bar" ext:md')]);

		expect(options.map(option => option.value)).toEqual(['Projects/Foo Bar/Beta.md']);
	});

	test('resolves folders', () => {
		const mb = createTestMetaBind();
		const resolver = new OptionSourceResolver();

		const options = resolver.resolve(mb, [optionSource('folder from:Projects')]);

		expect(options.map(option => option.value)).toEqual(['Projects', 'Projects/Foo Bar']);
	});

	test('resolves nested tags', () => {
		const mb = createTestMetaBind();
		const resolver = new OptionSourceResolver();

		const options = resolver.resolve(mb, [optionSource('tag from:#include/me')]);

		expect(options.map(option => option.value)).toEqual(['#include/me/A', '#include/me/B']);
	});

	test('normalizes tags without leading hashes', () => {
		const mb = createTestMetaBind();
		mb.file.setFileTags('Projects/Foo Bar/Beta.md', ['topic']);
		const resolver = new OptionSourceResolver();

		const options = resolver.resolve(mb, [optionSource('tag from:topic')]);

		expect(options.map(option => option.value)).toEqual(['#topic']);
	});

	test('filters files by tag', () => {
		const mb = createTestMetaBind();
		const resolver = new OptionSourceResolver();

		const options = resolver.resolve(mb, [optionSource('file tag:#person')]);

		expect(options.map(option => option.value)).toEqual(['People/Ada.md']);
	});

	test('deduplicates options by value', () => {
		const mb = createTestMetaBind();
		const resolver = new OptionSourceResolver();

		const options = resolver.resolve(mb, [optionSource('file from:People'), optionSource('file tag:#person')]);

		expect(options.map(option => option.value)).toEqual(['People/Ada.md']);
	});

	test('deduplicates explicit and generated options by value', () => {
		const mb = createTestMetaBind();
		const explicitOptions = [
			{ value: 'People/Ada.md', name: 'Ada' },
			{ value: 'custom', name: 'Custom' },
		];

		const options = deduplicateOptions([
			...explicitOptions,
			...mb.optionSourceResolver.resolve(mb, [optionSource('file from:People')]),
		]);

		expect(options.map(option => option.value)).toEqual(['People/Ada.md', 'custom']);
	});

	test('skips invalid queries', () => {
		const mb = createTestMetaBind();
		const resolver = new OptionSourceResolver();

		const options = resolver.resolve(mb, [optionSource('file from:Projects/Foo Bar')]);

		expect(options).toEqual([]);
	});
});
