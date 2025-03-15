<script lang="ts">
	import { AttributeTypeEnum, syncAttributes } from '$lib/attribute/attribute-service';
	import {
		openAttributeEditDialog,
		openAttributePickerDialog,
		openAttributeTypePickerDialog
	} from '$lib/attribute/attribute-ui-service';
	import AttributeList from '$lib/attribute/components/attribute-list.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import { mdiSync } from '$lib/core/services/app-icons-service';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { Button, ContentArea, Drawer, isMobileScreen, Sidebar } from '@cloudparker/moldex.js';

	let attributeListRef: AttributeList;
	let drawerRef: Drawer;
	let country = $state('');
	let isSyncInProgress = $state(false);

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleAddAttribute() {
		let typeId = await openAttributeTypePickerDialog();
		if (typeId) {
			let res = await openAttributeEditDialog({
				attributeType: typeId
			});

			if (res) {
				loadAttributes();
			}
		}
	}

	async function loadAttributes() {
		attributeListRef && attributeListRef.loadAttributes();
	}

	async function handleSync() {
		isSyncInProgress = true;
		await syncAttributes();
		await loadAttributes();
		isSyncInProgress = false;
	}

	async function handleSelectAttribute() {
		let res: string = (await openAttributePickerDialog({
			attributeType: AttributeTypeEnum.COUNTRY,
			value: country,
			multiple: true,
			maxlength: 3
		})) as string;
		console.log(res);
		country = res;
	}
</script>

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="pb-32">
					<div class="p-4 flex flex-wrap items-center gap-4">
						<div class="flex-grow"><h1 class="text-xl font-black dark:text-base-200">Attributes</h1></div>
						<div>
							<Button
								appearance="base"
								onClick={handleSync}
								title="Sync"
								iconPath={mdiSync}
								iconClassName={isSyncInProgress ? 'animate-spin' : ''}
							/>
						</div>
						<div class="w-full sm:w-auto">
							<Button
								appearance="border-primary"
								onClick={handleAddAttribute}
								label="Add Attribute"
								className="w-full sm:w-auto"
							/>
						</div>
					</div>
					<div class="m-4 p-2 lg:p-4 bg-white dark:bg-base-800 shadow rounded-lg">
						<AttributeList bind:this={attributeListRef} />
					</div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
