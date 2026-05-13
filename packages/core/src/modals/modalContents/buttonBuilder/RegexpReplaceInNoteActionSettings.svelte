<script lang="ts">
	import type { MetaBind } from 'meta-bind-core/src';
	import type { RegexpReplaceInNoteButtonAction } from 'meta-bind-core/src/config/ButtonConfig';

	import SettingComponent from 'meta-bind-core/src/utils/components/SettingComponent.svelte';

	const {
		mb,
		action = $bindable(),
	}: {
		mb: MetaBind;
		action: RegexpReplaceInNoteButtonAction;
	} = $props();
</script>

<SettingComponent name="Regexp" description="The regexp to find replacements.">
	<input type="text" bind:value={action.regexp} />
</SettingComponent>

<SettingComponent name="Regexp flags" description="The regexp flags for this regexp.">
	<input type="text" bind:value={action.regexpFlags} placeholder="g" />
</SettingComponent>

<SettingComponent name="Replacement text" description="The text to replace the button with."></SettingComponent>
<div class="meta-bind-full-width meta-bind-high">
	<textarea bind:value={action.replacement}></textarea>
</div>
