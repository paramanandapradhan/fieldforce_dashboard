<script lang="ts">
	import { mdiAlertOctagon } from '$lib/core/services/app-icons-service';
	import { Button, Icon, showToast } from '@cloudparker/moldex.js';
	import { openOrgEditDialog } from '$lib/org/org-ui-service';
	import { authState } from '../services/auth-state.svelte';

	async function handleCreateOrganization() {
		if ( authState. isEmailVerificationRequired) {
			return showToast({ msg: 'Email verification required!' });
		}
		if (authState.isUserNameRequired) {
			return showToast({ msg: 'User Name required!' });
		}
		let result = await openOrgEditDialog();
	}
</script>

<div class="bg-white shadow rounded p-4">
	<div class="flex flex-col md:flex-row gap-4">
		<div>
			<Icon path={mdiAlertOctagon} className="text-primary  !w-16 !h-16"></Icon>
		</div>
		<div class="ms-3">
			<h6 class="text-primary text-2xl font-bold">Bussiness Registration Missing</h6>
			<div class="my-4 text-base">To use the app, register an business or contact admin.</div>
			<div class="mt-10">
				<Button type="button" appearance="primary" onClick={handleCreateOrganization}
					>Register Now</Button
				>
			</div>
		</div>
	</div>
</div>
