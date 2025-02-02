<script lang="ts">
	import type { UserDataModel } from '$lib/user/user-types';
	import { Button, Icon, mdiEyeOutline, openLoadingDialog } from '@cloudparker/moldex.js';

	type Props = {
		input: UserDataModel;
		identityKey: 'email' | 'phone';
		showIdentity: boolean;
		iconPath?: string;
		iconClassName?: string;
	};

	let {
		input,
		identityKey,
		showIdentity,
		iconPath = mdiEyeOutline,
		iconClassName = ''
	}: Props = $props();

	let isShowing = $state(false);

	async function handleShow() {
		if (input && input._id && input) {
			let loading = await openLoadingDialog();
			try {
				// let res = await fetchUser(input._id);
				// if (res) {
				// 	input = res;
				// 	isShowing = true;
				// }
			} catch (error) {}
			loading.closeDialog();
		}
	}
</script>

<span class="flex items-center text-center">
	<span class="text-base-600">
		{#if isShowing}
			<span>{input[identityKey] || 'Not available'}</span>
		{:else}
			<span>******</span>
		{/if}
	</span>
	{#if !isShowing && showIdentity && !input[identityKey] && !input[identityKey]}
		<span class="">
			<Button className="" onClick={handleShow}>
				<Icon path={iconPath} className=" {iconClassName}"></Icon>
			</Button>
		</span>
	{/if}
</span>
