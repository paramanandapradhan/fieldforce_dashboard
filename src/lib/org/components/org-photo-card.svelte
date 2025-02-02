<script lang="ts">
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import {
		getDialogSize,
		isMobileScreen,
		openImagePickerDialogWithCropper,
		openLoadingDialog,
		ripple,
		showErrorToast
	} from '@cloudparker/moldex.js';
	import type { OrgDataModel } from '../org-types';
	import OrgPhoto from './org-photo.svelte';
	import { getOrg, updateOrg } from '../org-service';
	import { uploadFileToStorage } from '$lib/firebase/storage-service';

	type Props = {
		input?: string;
		title?: string;
	};

	let { input, title }: Props = $props();

	let org: OrgDataModel | null;
	let isReady: boolean = false;

	async function loadOrg(force?: boolean) {
		if (input && isReady) {
			org = await getOrg(input);
		}
	}

	function handleReady() {
		// console.log('ready');
		isReady = true;
		loadOrg();
	}

	async function handlePhotoChange() {
		let file = (await openImagePickerDialogWithCropper({
			outputWidth: 340,
			outputQuality: 0.8,
			dialogSize: getDialogSize()
		})) as File;
		if (file) {
			let loader = await openLoadingDialog();
			try {
				let fid = await uploadFileToStorage({
					file,
					collection: 'orgs',
					field: 'photo',
					docId: org?._id!
				});
				if (fid && org?._id) {
					await updateOrg(org?._id, { photo: fid });
					await loadOrg(true);
				}
			} catch (error) {
				showErrorToast();
			}
			await loader.closeDialog();
		}
	}

	function prepareOrg(..._: any) {
		loadOrg();
	}
</script>

<AuthUserReady onReady={handleReady} />
<div>
	<div>
		<h6>{title}</h6>
	</div>
	<div class="mt-3">
		<OrgPhoto imgClass="border rounded" input={org?.photo}></OrgPhoto>
	</div>
	<div class="mt-3">
		<button type="button" class="btn btn-sm btn-light" onclick={handlePhotoChange} use:ripple>
			Change {title}
		</button>
	</div>
</div>
