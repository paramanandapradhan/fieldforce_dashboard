<script lang="ts">
	import type { OrgDataModel } from '$lib/org/org-types';
	import { BROWSER } from 'esm-env';
	import { getOrg } from '../org-service';

	/**
	 * Org id need to be in input
	 */
	export let input: string | undefined | null;

	let org: OrgDataModel | null;

	async function prepareOrg(..._: any) {
		if (input) {
			org = await getOrg(input);
		} else {
			org = null;
		}
	}

	$: BROWSER && prepareOrg(input);
</script>

{org?.name || ''}
