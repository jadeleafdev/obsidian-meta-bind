<script lang="ts">
	import type { MetaBind } from 'meta-bind-core/src';
	import type { MetaBindDate } from 'meta-bind-core/src/api/MetaBindDate';
	import { getDateRows, getWeekDays } from 'meta-bind-core/src/utils/DatePickerUtils.js';

	let {
		mb,
		selectedDate,
		month,
		year,
		dateChange,
	}: {
		mb: MetaBind;
		selectedDate: MetaBindDate | null;
		month: number;
		year: number;
		dateChange: (date: MetaBindDate) => void;
	} = $props();

	// local vars to help in render
	let cells = $derived(getDateRows(month, year));

	function selectCell(value: number | undefined): void {
		if (value) {
			dateChange(mb.dateParser.fromDate(new Date(year, month, value)));
		}
	}

	function selectCellKey(event: KeyboardEvent, date: number): void {
		if (event.key === ' ') {
			selectCell(date);
		}
	}
</script>

<div class="mb-calendar">
	<div class="mb-calendar-header">
		{#each getWeekDays() as day}
			<div class="mb-calendar-cell mb-calendar-header-cell">
				<span class="mb-calendar-cell-text">{day}</span>
			</div>
		{/each}
	</div>

	<div class="mb-calendar-content">
		{#each cells as value, index (index)}
			<div
				class="mb-calendar-cell"
				onclick={() => selectCell(value)}
				onkeydown={event => selectCellKey(event, value)}
				role="button"
				tabindex="0"
				class:mb-calendar-highlight={value}
				class:mb-calendar-content-cell={value}
				class:mb-calendar-selected={selectedDate?.year() === year &&
					selectedDate?.month() === month &&
					selectedDate?.date() === value}
			>
				<span class="mb-calendar-cell-text">{value || ''}</span>
			</div>
		{/each}
	</div>
</div>
