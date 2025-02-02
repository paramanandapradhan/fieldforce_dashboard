<script lang="ts">
	import { Button, Icon, mdiCheckCircle, type DialogExports } from '@cloudparker/moldex.js';
	import TextOrg from '$lib/org/components/text-org.svelte';
	import type { UserDataModel } from '$lib/user/user-types';
	import { switchAuthUser } from '../services/auth-service.svelte';
	import { authState } from '../services/auth-state.svelte';

	let { closeDialog, setResult }: DialogExports = $props();

	async function handleSwithUser(user: UserDataModel) {
		if (authState.authOrgUser?._id != user?._id) {
			await switchAuthUser(user);
			closeDialog();
		}
	}
</script>

<div class="">
	<h5 class="font-bold">Switch Account</h5>
	<h6 class="text-base-500">
		<span> Identity : </span>
		<span>{authState.authOrgUser?.email || authState.authOrgUser?.phone || ''}</span>
	</h6>
</div>
<div>
	{#each authState.authOrgUsers as user, index}
		<div class="my-1">
			<Button className="w-full" onClick={() => handleSwithUser(user)}>
				<div></div>
				<div class="flex-grow-1">
					<div class="font-bold"><TextOrg input={user?.oid} /></div>
					<div>{user?.name || ''}</div>
				</div>
				<div>
					<Icon
						path={mdiCheckCircle}
						className={user._id == authState.authOrgUser?._id &&
						user.oid == authState.authOrgUser?.oid
							? 'text-primary'
							: 'text-base-500'}
					/>
				</div>
			</Button>
		</div>
	{/each}
</div>
