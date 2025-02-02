<script lang="ts">
	import { BROWSER } from 'esm-env';
	import type { OrgDataModel } from '../org-types';
	import OrgPhoto from './org-photo.svelte';
	import { ripple } from '@cloudparker/moldex.js';
	import { getOrg } from '../org-service';

	let input: string;

	let org: OrgDataModel;

	async function loadOrg() {
		if (input) {
			org = await getOrg(input);
		}
	}

	function prepare(..._: any) {
		loadOrg();
	}

	$: BROWSER && prepare(input);
</script>

<div>
	<div class="d-flex align-items-center">
		<div style="width:120px">
			<OrgPhoto imgClass="border rounded" input={org?.photo}></OrgPhoto>
		</div>
		<div>
			<div class="bold">{org?.name || ''}</div>
			<div class="grey small">{org?.desc || ''}</div>
			<div class="text-end pt-3">
				<button type="button" class="btn btn-sm" use:ripple>Goto Business</button>
			</div>
		</div>
	</div>
</div>
