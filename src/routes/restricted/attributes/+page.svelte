<script lang="ts">
	import { AttributeTypeEnum } from '$lib/attribute/attribute-service';
	import {
		openAttributeEditDialog,
		openAttributePickerDialog,
		openAttributeTypePickerDialog
	} from '$lib/attribute/attribute-ui-service';
	import AttributeList from '$lib/attribute/components/attribute-list.svelte';
	import TextAttribute from '$lib/attribute/components/text-attribute.svelte';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { Button, ContentArea, Drawer, isMobileScreen, Sidebar } from '@cloudparker/moldex.js';

	let attributeListRef: AttributeList;
	let drawerRef: Drawer;
	let country = $state('');

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
				attributeListRef.loadAttributes();
			}
		}
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
				<div class="flex items-center justify-between m-4">
					<div><h1 class="text-xl font-black">Attributes</h1></div>
					<div>
						<Button
							appearance="border-primary"
							onClick={handleAddAttribute}
							label="Add Attribute"
						/>
					</div>
				</div>
				<div class="my-4">
					<AttributeList bind:this={attributeListRef} />
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
