<script lang="ts">
	import { Notice, stringifyYaml } from 'obsidian';
	import type { MetaBind } from 'meta-bind-core/src';
	import type { ButtonConfig } from 'meta-bind-core/src/config/ButtonConfig';
	import { ButtonStyleType } from 'meta-bind-core/src/config/ButtonConfig';
	import Button from 'meta-bind-core/src/utils/components/Button.svelte';
	import FlexRow from 'meta-bind-core/src/utils/components/FlexRow.svelte';
	import Icon from 'meta-bind-core/src/utils/components/Icon.svelte';

	let {
		mb,
		template = $bindable(),
		onDelete,
	}: {
		mb: MetaBind;
		template: ButtonConfig;
		onDelete: (template: ButtonConfig) => void;
	} = $props();

	function editTemplate(): void {
		mb.internal.openButtonBuilderModal({
			submitText: 'Submit',
			config: $state.snapshot(template),
			onOkay: newTemplate => {
				template = newTemplate;
			},
		});
	}

	function copyTemplate(): void {
		const yaml = stringifyYaml($state.snapshot(template));
		void navigator.clipboard.writeText(yaml);
		new Notice('meta-bind | Copied to clipboard');
	}
</script>

<div class="mb-card markdown-rendered">
	<FlexRow stretchChildren={true}>
		<span>{template.id}</span>
		<Button onclick={() => editTemplate()} variant={ButtonStyleType.PRIMARY} tooltip="Edit">
			<Icon mb={mb} iconName="pen-line" />
		</Button>
		<Button onclick={() => copyTemplate()} variant={ButtonStyleType.DEFAULT} tooltip="Copy">
			<Icon mb={mb} iconName="copy" />
		</Button>
		<Button onclick={() => onDelete(template)} variant={ButtonStyleType.DESTRUCTIVE} tooltip="Delete">
			<Icon mb={mb} iconName="x" />
		</Button>
	</FlexRow>
	<pre class="mb-pre"><code class="mb-none">{stringifyYaml(template)}</code></pre>
</div>
