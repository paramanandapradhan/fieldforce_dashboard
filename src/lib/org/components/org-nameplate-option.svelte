<script lang="ts">
	import type { OrgDataModel } from '../org-types';
	import OrgPhoto from './org-photo.svelte';
	import { goto } from '$app/navigation';
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { Icon, mdiChevronRight, ripple } from '@cloudparker/moldex.js';
	import { getAuthOrg } from '$lib/auth/services/auth-service.svelte';

	let org: OrgDataModel | undefined = {};

	async function loadOrg(force?: boolean) {
		org = await getAuthOrg();
		// console.log('loadOrg', org);
	}

	async function prepare(force?: boolean) {
		await loadOrg(force);
	}

	async function handleReady() {
		prepare();
	}

	function handleOrgDetails() {
		if (org) {
			goto('/console-admin/orgs/view?id=' + org._id);
		}
	}
</script>

<AuthUserReady onReady={handleReady} />
<div class=" ">
	<button
		type="button"
		class="btn btn-sm w-100 border-0 rounded-0 text-start p-0"
		use:ripple
		on:click={handleOrgDetails}
	>
		<div class="d-flex">
			<div style="width:128px;min-width:128px;">
				<OrgPhoto imgClass="" input={org?.photo}></OrgPhoto>
			</div>
			<div class="flex-grow-1 p-3 align-self-center">
				<div class="smaller fw-light grey">BUSINESS</div>
				<div class="fs-6 bold">{org?.name || ''}</div>
				<div style="max-height: 48px; overflow: hidden;" class="grey text-break">
					{org?.desc || ''}
				</div>
			</div>
			<div class="pe-3 align-self-center">
				<Icon path={mdiChevronRight} />
			</div>
		</div>
	</button>
</div>
