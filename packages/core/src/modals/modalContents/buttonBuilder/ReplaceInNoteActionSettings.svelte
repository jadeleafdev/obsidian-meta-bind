<script lang="ts">
	import type { MetaBind } from 'meta-bind-core/src';
	import type { ReplaceInNoteButtonAction } from 'meta-bind-core/src/config/ButtonConfig';

	import SettingComponent from 'meta-bind-core/src/utils/components/SettingComponent.svelte';

	const {
		mb,
		action = $bindable(),
	}: {
		mb: MetaBind;
		action: ReplaceInNoteButtonAction;
	} = $props();
</script>

<SettingComponent name="Line from" description="The line that marks the start of the area to replace.">
	<input type="number" bind:value={action.fromLine} placeholder="0" />
</SettingComponent>

<SettingComponent name="Line to" description="The line that marks the end of the area to replace.">
	<input type="number" bind:value={action.toLine} placeholder="0" />
</SettingComponent>

<SettingComponent name="Replacement text" description="The text to replace the note section."></SettingComponent>
<div class="meta-bind-full-width meta-bind-high">
	<textarea bind:value={action.replacement}></textarea>
</div>
