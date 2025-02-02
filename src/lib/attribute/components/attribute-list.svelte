<script lang="ts">
	import AuthAttributeReady from '$lib/auth/components/auth-user-ready.svelte';
	import { Button, ButtonMenu } from '@cloudparker/moldex.js';
	import { getAllAttributes } from '../attribute-service';
	import type { AttributeDataModel } from '../attribute-types';
	import {
		openAttributeDeleteDialog,
		openAttributeDetailsDialog,
		openAttributeEditDialog
	} from '../attribute-ui-service';
	import TextAttributeType from './text-attribute-type.svelte';

	let attributes: AttributeDataModel[] = $state([]);

	export async function loadAttributes() {
		attributes = (await getAllAttributes()) || [];
	}

	function handleReady() {
		loadAttributes();
	}

	async function handleMenu(ev: MouseEvent, menu: string, attr: AttributeDataModel) {
		switch (menu) {
			case 'Edit':
				await openAttributeEditDialog({
					attribute: attr,
					attributeType: attr.type!
				});
				await loadAttributes();
				break;
			case 'Delete':
				await openAttributeDeleteDialog(attr);
				await loadAttributes();
				break;
		}
	}

	async function handleItemClick(ev: MouseEvent, attr: AttributeDataModel) {
		if (attr?._id) {
			await openAttributeDetailsDialog(attr._id);
		}
	}
</script>

<AuthAttributeReady onReady={handleReady} />
<div>
	{#each attributes as attr, index}
		<div>
			<Button className="w-full text-start !px-4" onClick={(ev) => handleItemClick(ev, attr)}>
				<div></div>
				<div class="flex-grow">
					<div>{attr.name || ''}</div>
					<div class="text-sm text-base-400">{attr.desc || ''}</div>
				</div>
				<div>
					<span class="text-sm font-bold text-base-400">
						<TextAttributeType input={attr.type} />
					</span>
				</div>
				<div>
					<ButtonMenu
						menus={['Edit', 'Delete']}
						onMenu={(ev, menu) => handleMenu(ev, menu as string, attr)}
					/>
				</div>
			</Button>
		</div>
	{/each}
</div>
