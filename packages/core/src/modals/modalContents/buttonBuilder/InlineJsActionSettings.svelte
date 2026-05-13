<script lang="ts">
	import type { MetaBind } from 'meta-bind-core/src';
	import type { InlineJSButtonAction } from 'meta-bind-core/src/config/ButtonConfig';

	import SettingComponent from 'meta-bind-core/src/utils/components/SettingComponent.svelte';

	const {
		mb,
		action = $bindable(),
	}: {
		mb: MetaBind;
		action: InlineJSButtonAction;
	} = $props();
</script>

<SettingComponent name="JS code" description="The JavaScript code to run."></SettingComponent>

<div class="meta-bind-full-width meta-bind-high">
	<textarea bind:value={action.code}></textarea>
</div>
