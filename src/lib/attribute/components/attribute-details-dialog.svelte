<script lang="ts">
	import AttributeDetails from './attribute-details.svelte';

	type Props = {
		attributeId: string;
	};
	let { attributeId }: Props = $props();
</script>

<div class="h-full">
	<AttributeDetails {attributeId} />
</div>
