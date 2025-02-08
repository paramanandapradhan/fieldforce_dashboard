<script lang="ts">
	import { NumberField, TextField, type DialogExports } from '@cloudparker/moldex.js';

	import type { RouteDataModel } from '../route-types';
	import { serverTimestamp } from 'firebase/firestore';
	import { createRoute, getRoute, syncRoutes, updateRoute } from '../route-service';
	import UserComboboxField from '$lib/user/components/user-combobox-field.svelte';
	import { UserTypeEnum } from '$lib/user/user-service';

	type Props = {
		route?: RouteDataModel;
	};

	let { route, closeDialog, setResult, setOkSpinner, setOkEnabled }: Props & DialogExports =
		$props();

	let name: string = $state(route?.name || '');
	let desc: string = $state(route?.desc || '');
	let manager: string = $state(route?.manager || '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		name = (name || '').trim();
		desc = (desc || '').trim();
		manager = (manager || '').trim();

		if (name) {
			try {
				setOkSpinner(true);
				setOkEnabled(false);
				let id = null;
				let payload = { name, desc, manager };
				if (route?._id) {
					id = await updateRoute(route?._id, payload);
				} else {
					id = await createRoute(payload);
				}
				if (id) {
					await syncRoutes();
					let res = await getRoute(id);
					closeDialog(res);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setOkSpinner(false);
				setOkEnabled(true);
			}
		}
	}
</script>

<form id="route-edit-form" onsubmit={handleSubmit}>
	<div class="px-6 pb-60">
		<div class="my-4">
			<TextField name="name" label="Route Name" maxlength={50} bind:value={name} />
		</div>
		<div class="my-4">
			<TextField name="desc" label="Description" maxlength={100} bind:value={desc} />
		</div>

		<div class="my-4">
			<UserComboboxField
				userType={UserTypeEnum.USER_TYPE_USER}
				name="manager"
				label="Manager"
				bind:value={manager}
			/>
		</div>
	</div>
</form>
