import { describe, expect, test } from 'bun:test';
import { normalizeFirstWeekday } from 'meta-bind-core/src/Settings';

describe('settings', () => {
	describe('normalizeFirstWeekday', () => {
		test('keeps valid weekday names', () => {
			expect(normalizeFirstWeekday('Sunday')).toBe('Sunday');
			expect(normalizeFirstWeekday('Wednesday')).toBe('Wednesday');
		});

		test('migrates legacy weekday objects', () => {
			expect(normalizeFirstWeekday({ index: 5, name: 'Friday', shortName: 'Fr' })).toBe('Friday');
		});

		test('accepts numeric weekday indexes defensively', () => {
			expect(normalizeFirstWeekday(6)).toBe('Saturday');
		});

		test('falls back to Monday for invalid values', () => {
			expect(normalizeFirstWeekday('Funday')).toBe('Monday');
			expect(normalizeFirstWeekday({ name: 1 })).toBe('Monday');
			expect(normalizeFirstWeekday(undefined)).toBe('Monday');
		});
	});
});
