import { expect, test } from 'bun:test';
import { TestMetaBind } from '../__mocks__/TestPlugin';

test('parses and stringifies using the preferred date format', () => {
	const mb = new TestMetaBind();
	mb.settings.preferredDateFormat = 'DD/MM/YYYY';

	const date = mb.dateParser.parse('02/03/3456');

	expect(date.isValid()).toBeTrue();
	expect(date.date()).toBe(2);
	expect(date.month()).toBe(2);
	expect(date.year()).toBe(3456);
	expect(mb.dateParser.stringify(date)).toBe('02/03/3456');
});

test('creates dates from native Date values through the internal API', () => {
	const mb = new TestMetaBind();
	const date = mb.dateParser.fromDate(new Date(2024, 5, 9));

	expect(date.date()).toBe(9);
	expect(date.month()).toBe(5);
	expect(date.year()).toBe(2024);
});
