<script lang="ts">
	import type { MetaBind } from 'meta-bind-core/src';
	import type { Command } from 'meta-bind-core/src/api/InternalAPI';
	import type { CommandButtonAction } from 'meta-bind-core/src/config/ButtonConfig';
	import { ButtonStyleType } from 'meta-bind-core/src/config/ButtonConfig';

	import Button from 'meta-bind-core/src/utils/components/Button.svelte';
	import SettingComponent from 'meta-bind-core/src/utils/components/SettingComponent.svelte';

	const {
		mb,
		action = $bindable(),
	}: {
		mb: MetaBind;
		action: CommandButtonAction;
	} = $props();

	function changeCommand(): void {
		mb.internal.openCommandSelectModal((command: Command) => {
			action.command = command.id;
		});
	}
</script>

<SettingComponent
	name="Command: {action.command || 'none'}"
	description="The command to execute when this action runs."
>
	<Button variant={ButtonStyleType.PRIMARY} onclick={() => changeCommand()}>Change</Button>
</SettingComponent>
