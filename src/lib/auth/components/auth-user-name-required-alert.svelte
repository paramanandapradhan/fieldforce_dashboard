<script lang="ts">
	import { Button, Icon, openLoadingDialog, openTextFieldDialog } from '@cloudparker/moldex.js';
	import { mdiAlertOctagon } from '$lib/core/services/app-icons-service';
	import { refreshClaim, updateFirebaseAuthUserName } from '../services/auth-service.svelte';


	async function handleAddUserName() {
		let name: any = await openTextFieldDialog({
			title: 'User Name',
			label: 'You Name',
			required: true,
			cancelable: false
		});
		if (name) {
			name = (name || '').trim();
			if (name) {
				let loading = await openLoadingDialog();
				await  updateFirebaseAuthUserName(name);
				await  refreshClaim(true);
				await loading.closeDialog();
			}
		}
	}
</script>

<div class="bg-white shadow rounded p-4">
	<div class="flex flex-col md:flex-row gap-4">
		<div>
			<Icon path={mdiAlertOctagon} className="text-primary  !w-16 !h-16"></Icon>
		</div>
		<div class="ms-3">
			<h6 class="text-primary text-2xl font-bold">User Name Missing</h6>
			<div class="my-4 text-base">A username is required to begin with the application.</div>
			<div class="mt-10">
				<Button type="button" appearance="primary" onClick={handleAddUserName}>Add User Name</Button
				>
			</div>
		</div>
	</div>
</div>
