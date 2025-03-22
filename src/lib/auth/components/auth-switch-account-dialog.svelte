<script lang="ts">
	import {
		Button,
		ButtonListItem,
		Icon,
		IconCircle,
		mdiCheckCircle,
		type DialogExports
	} from '@cloudparker/moldex.js';
	import TextOrg from '$lib/org/components/text-org.svelte';
	import type { ClaimUsers, UserDataModel } from '$lib/user/user-types';
	import { getAuthOrgUser, getAuthOrgUsers, switchAuthUser } from '../services/auth-service.svelte';
	import { authState } from '../services/auth-state.svelte';
	import { onMount } from 'svelte';
	import TextUser from '$lib/user/components/text-user.svelte';
	import { mdiCity } from '$lib/core/services/app-icons-service';

	let { closeDialog, setResult }: DialogExports = $props();

	let authUsers: ClaimUsers[] = $state([]);

	async function handleSwithUser(user: ClaimUsers) {
		console.log('handleSwithUser', user);
		let authUser = await getAuthOrgUser();
		if (authUser?._id != user?._id) {
			await switchAuthUser(user);
			closeDialog();
		} else {
			closeDialog();
		}
	}

	async function loadAuthUsers() {
		authUsers = (await getAuthOrgUsers()) || [];
		console.log('loadAuthUsers', authUsers);
	}

	onMount(() => {
		loadAuthUsers();
	});
</script>

<div class="p-6 min-h-80">
	{#each authUsers as user, index}
		<div class="my-1">
			<ButtonListItem className="gap-4" onClick={() => handleSwithUser(user)}>
				<div>
					<IconCircle iconPath={mdiCity}></IconCircle>
				</div>
				<div class="flex-grow">
					<div class="font-bold dark:text-base-300">
						<TextOrg input={user?.oid} />
					</div>
					<div class="dark:text-base-500 text-sm font-light">
						<TextUser input={user._id} hideIcon hideDropdown />
					</div>
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
			</ButtonListItem>
		</div>
	{/each}
</div>
