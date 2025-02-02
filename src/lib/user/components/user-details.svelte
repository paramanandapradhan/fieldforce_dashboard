<script lang="ts">
	import { ROOT_ORG_ID } from '$lib/core/services/app-core-service';
	import { mdiCheckCircleOutline } from '$lib/core/services/app-icons-service';
	import { Button, Icon, openImagePickerDialogWithCropper, Spinner } from '@cloudparker/moldex.js';
	import type { UserDataModel } from '../user-types';
	import UserLoader from './user-loader.svelte';
	import { syncFiles, uploadFile } from '$lib/file/file-service';
	import { syncUsers, updateUser } from '../user-service';
	import ImgFile from '$lib/core/services/img-file.svelte';

	type Props = {
		userId?: string;
		showRootUserInfo: boolean;
	};

	let { userId, showRootUserInfo = false }: Props = $props();

	let user: UserDataModel | null | undefined = $state();

	async function handleChangePhoto() {
		let file = await openImagePickerDialogWithCropper({ outputAspectRatio: 1 });
		if (file && user?._id) {
			let fid = await uploadFile({ file, collection: 'users', docId: user?._id!, field: 'photo' });
			if (fid) {
				await syncFiles();
				await updateUser(user._id, { photo: fid });
				await syncUsers();
				userId = userId;
			}
		}
	}
</script>

<UserLoader {userId} bind:user>
	{#snippet placeholder()}
		<Spinner />
	{/snippet}

	{#if user}
		<div class="flex flex-col lg:flex-row gap-6">
			<div class="min-w-52 max-w-52">
				<div class="rounded border w-full aspect-square">
					<ImgFile alt="Profile Image" input={user.photo} />
				</div>
				<div class="flex justify-center mt-4">
					<Button appearance="border-base" onClick={handleChangePhoto}>Change Photo</Button>
				</div>
			</div>
			<div class="flex-grow">
				<div class="mb-4">
					<div>
						<h5 class="font-bold">{user?.name || ''}</h5>
					</div>
					<div>
						{user?.desc || ''}
					</div>
				</div>
				<table class="text-sm table-auto">
					<tbody>
						<tr>
							<td>Phone Number</td>
							<td>{user?.phone || 'Note Avelable'}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{user?.email || '-'}</td>
						</tr>
						<tr>
							<td>Role</td>
							<td>
								{#if user.rid === '1'}
									<span>Admin</span>
								{:else}
									-
								{/if}
							</td>
						</tr>
						{#if showRootUserInfo && user.oid == ROOT_ORG_ID}
							<tr>
								<td>Root User</td>
								<td>
									{#if user.ur}
										<span title="Application Root User">
											<Icon path={mdiCheckCircleOutline} sizeClassName="h-[16px] w-[16px]"></Icon>
										</span>
									{:else}
										-
									{/if}
								</td></tr
							>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</UserLoader>

<style>
	td:nth-child(1) {
		color: grey;
		width: 120px;
		height: 36px;
	}
</style>
