<script lang="ts">
	import { onMount } from 'svelte';
	import { getUser } from '../user-service';
	import type { CustomerDataModel, UserDataModel } from '../user-types';
	import { IconCircle, TextDate } from '@cloudparker/moldex.js';
	import { mdiAccount, mdiBriefcaseAccount } from '$lib/core/services/app-icons-service';
	import TextUserSubtype from './text-user-subtype.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import TextUser from './text-user.svelte';
	import TextUserType from './text-user-type.svelte';

	type Props = {
		userId: any;
	};

	let { userId }: Props = $props();
	let user: UserDataModel | null = $state(null);

	async function loadUser() {
		if (userId) {
			user = await getUser(userId);
		} else {
			user = null;
		}
	}

	onMount(() => {
		loadUser();
	});
</script>

<div>
	<h4 class="text-xl font-bold mb-4">User Details</h4>
	<div class="flex md:flex-row flex-col gap-4">
		<div>
			<IconCircle
				iconPath={mdiAccount}
				iconClassName="text-primary"
				circleClassName=" "
			/>
		</div>
		<div>
			<table>
				<tbody>
					<tr class="lg:text-lg lg:font-bold font-semibold"
						><td>Name</td><td>{user?.name || '-'}</td></tr
					>
					<tr><td>Description</td><td class="text-base-500 text-sm">{user?.desc || '-'}</td></tr
					>
					<tr><td>Email</td><td>{user?.email || '-'}</td></tr>
					<tr><td>Phone</td><td>{user?.phone || '-'}</td></tr>
					<tr><td>Type</td><td><TextUserType input={user?.type! || '-'} /></td></tr>
					<tr><td>Sub Type</td><td><TextUserSubtype input={user?.subtype! || '-'}/> </td></tr>
					<tr><td>Designation</td><td><TextAttribute input={user?.desig || '-'}/> </td></tr>
					<tr><td>Department</td><td><TextAttribute input={user?.dept || '-'}/> </td></tr>
					<tr><td>DOB</td><td><TextDate input={user?.dob || '-'}/> </td></tr>
					<tr><td>DOJ</td><td><TextDate input={user?.doj || '-'}/> </td></tr>
					<tr><td>Address</td> <td>{user?.address || '-'}</td></tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	td:nth-child(1) {
		color: var(--color-base-400);
		width: 180px;
	}
	td:nth-child(2) {
		color: var(--color-base-500);
		width: 300px;
	}
</style>
