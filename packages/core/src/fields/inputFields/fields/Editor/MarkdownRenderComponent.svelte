<script lang="ts">
	import type { MetaBind } from 'meta-bind-core/src';
	import { DomHelpers } from 'meta-bind-core/src/utils/Utils';
	import { onDestroy } from 'svelte';

	let element: HTMLElement;

	const {
		value,
		mb,
		filePath,
	}: {
		value: string;
		mb: MetaBind;
		filePath: string;
	} = $props();

	let markdownUnloadCallback: (() => void) | undefined = undefined;

	onDestroy(() => {
		markdownUnloadCallback?.();
	});

	async function render(v: string): Promise<void> {
		markdownUnloadCallback?.();
		DomHelpers.empty(element);
		markdownUnloadCallback = await mb.internal.renderMarkdown(v, element, filePath);
	}

	$effect(() => void render(value));
</script>

<div bind:this={element}></div>
