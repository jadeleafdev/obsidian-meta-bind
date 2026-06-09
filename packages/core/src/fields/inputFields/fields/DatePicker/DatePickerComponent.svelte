<script lang="ts">
	import type { MetaBindDate } from 'meta-bind-core/src/api/MetaBindDate';
	import type { InputFieldSvelteProps } from 'meta-bind-core/src/fields/inputFields/InputFieldSvelteWrapper';
	import Icon from 'meta-bind-core/src/utils/components/Icon.svelte';

	const props: InputFieldSvelteProps<MetaBindDate | null> & {
		dateFormat: string;
		showDatePicker: () => void;
	} = $props();

	let value = $state(props.value);

	export function setValue(v: MetaBindDate | null): void {
		value = v;
	}

	function datePicker(): void {
		props.showDatePicker();
	}

	function datePickerKey(event: KeyboardEvent): void {
		if (event.key === ' ') {
			props.showDatePicker();
		}
	}
</script>

<div class="mb-date-picker-input" onclick={datePicker} onkeydown={datePickerKey} role="button" tabindex="0">
	<span class="mb-date-picker-text">{value ? value.format(props.dateFormat) : 'none'}</span>
	<Icon mb={props.mb} iconName="calendar" />
</div>
