<script lang="ts">
	import { RenderChildType } from 'meta-bind-core/src/config/APIConfigs';
	import { InputFieldMountable } from 'meta-bind-core/src/fields/inputFields/InputFieldMountable';

	import type { InputFieldDeclaration } from 'meta-bind-core/src/parsers/inputFieldParser/InputFieldDeclaration';
	import MountableComponent from 'meta-bind-core/src/utils/components/MountableComponent.svelte';
	import { getUUID } from 'meta-bind-core/src/utils/Utils';
	import type { MetaBind } from '../..';

	const {
		mb,
		declaration,
	}: {
		mb: MetaBind;
		declaration: InputFieldDeclaration;
	} = $props();

	let field = new InputFieldMountable(mb, getUUID(), '', RenderChildType.BLOCK, declaration);
</script>

<MountableComponent mountable={field}></MountableComponent>
