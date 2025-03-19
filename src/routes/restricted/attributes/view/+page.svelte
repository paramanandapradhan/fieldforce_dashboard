<script lang="ts">
	import {
		Button,
		CheckboxField,
		ColorField,
		ContentArea,
		Drawer,
		goBack,
		isMobileScreen,
		openLoadingDialog,
		screenSize,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { TeamDataModel } from '$lib/teams/team-type';
	import { getTeam } from '$lib/teams/team-service';
	import TeamDetails from '$lib/teams/components/team-details.svelte';
	import { openTeamEditDialog } from '$lib/teams/team-ui-service';
	import { getAllUsers, syncUsers, updateUser, UserTypeEnum } from '$lib/user/user-service';
	import type { UserDataModel } from '$lib/user/user-types';
	import { openUserPickerDialog } from '$lib/user/user-ui-service';
	import TeamUserList from '$lib/teams/components/team-user-list.svelte';
	import TeamUserTable from '$lib/teams/components/team-user-table.svelte';
	import type { AttributeDataModel } from '$lib/attribute/attribute-types';
	import { getAttribute } from '$lib/attribute/attribute-service';
	import { openAttributeEditDialog } from '$lib/attribute/attribute-ui-service';
	import AttributeView from '$lib/attribute/components/attribute-view.svelte';

	let drawerRef: Drawer;

	let attributeId: string = $derived(page.url.searchParams.get('attributeId') || '');
	let attribute: AttributeDataModel | null = $state(null);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function loadAttribute() {
		if (attributeId) {
			attribute = await getAttribute(attributeId);
		} else {
			attribute = null;
		}
	}

	async function handleEdit() {
		if (attribute) {
			let res = await openAttributeEditDialog({attribute:attribute, attributeType:attribute.type!});
			if (res) {
				loadAttribute();
			}
		}
	}

	onMount(() => {
		loadAttribute();
	});
</script>

<div class="min-h-full">
	<AppNavbar title="View Attribute" hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="pb-32">
					<div class="p-4 flex items-center justify-end">
						<Button appearance="border-primary" onClick={handleEdit} label="Edit" />
					</div>
					<div class="pb-2">
						{#if attribute != null}
							<div class="bg-white dark:bg-base-800 p-4 shadow rounded-lg m-4">
								<AttributeView {attributeId}/>
							</div>
						{/if}
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
