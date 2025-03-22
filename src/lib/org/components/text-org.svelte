<script lang="ts">
	import type { OrgDataModel } from '$lib/org/org-types';
	import { onMount } from 'svelte';
	import { getOrg } from '../org-service';

	type Props = {
		input: string | undefined | null;
	};
	let { input }: Props = $props();

	let org: OrgDataModel | null = $state(null);

	async function loadOrg() {
		if (input) {
			org = await getOrg(input);
		}
	}

	onMount(() => {
		loadOrg();
	});
</script>

<span>
	{org?.name || ''}
</span>
