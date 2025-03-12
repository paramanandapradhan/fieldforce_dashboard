<script context="module" lang="ts">
	export { userPickerListItemSnippet, customerPickerListItemSnippet };
</script>

<script lang="ts">
	import { IconCircle } from '@cloudparker/moldex.js';

	import { type CustomerDataModel, type UserDataModel } from '../user-types';
	import { mdiAccount, mdiBriefcaseAccount } from '$lib/core/services/app-icons-service';
</script>

{#snippet userPickerListItemSnippet(item: UserDataModel | CustomerDataModel, index: number)}
	<div>
		<IconCircle iconPath={mdiAccount}></IconCircle>
	</div>
	<div class="flex-grow px-2">
		<div>
			{item?.name || ''}
		</div>
		<div class="text-xs text-base font-thin">
			{item?.desc || ''}
		</div>
	</div>
{/snippet}

{#snippet customerPickerListItemSnippet(item: UserDataModel | CustomerDataModel, index: number)}
	<div>
		<IconCircle iconPath={mdiBriefcaseAccount}></IconCircle>
	</div>
	<div class="flex-grow px-2">
		<div>
			{item?.name || ''}
		</div>
		<div class="text-xs text-base font-thin">
			{item?.desc || ''}
		</div>
	</div>
{/snippet}
