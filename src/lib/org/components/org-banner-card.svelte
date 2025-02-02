<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { mdiCog } from '$lib/core/services/app-icons-service';
	import { Icon, ripple } from '@cloudparker/moldex.js';
	import type { OrgDataModel } from '../org-types';
	import OrgBannerImage from './org-banner-image.svelte';
	import { getOrg } from '../org-service';
	type Props = { input?: string; title?: string };
	let { input, title = 'Banners' }: Props = $props();

	let org: OrgDataModel = $derived.by(async () => {
		if (input) {
			return await getOrg(input);
		}
	});

	function handleReady() {
		input = input;
	}
</script>

<AuthUserReady onReady={handleReady} />
<div>
	<div>
		<h6>{title}</h6>
	</div>
	<div class="mt-3">
		<OrgBannerImage imgClass="border rounded" input={org?.photo}></OrgBannerImage>
	</div>
	<div class="mt-3 text-end gap-2">
		<button type="button" class="btn btn-sm btn-light px-2" use:ripple title="Manage Banners">
			<Icon path={mdiCog}></Icon>
		</button>
	</div>
</div>
