<script lang="ts" module>
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
	<div class="flex-grow">
		<div>
			{item?.name || ''}
		</div>
		<div class="text-sm text-base">
			{item?.desc || ''}
		</div>
	</div>
{/snippet}

{#snippet customerPickerListItemSnippet(item: UserDataModel | CustomerDataModel, index: number)}
	<div>
		<IconCircle iconPath={mdiBriefcaseAccount}></IconCircle>
	</div>
	<div class="flex-grow">
		<div>
			{item?.name || ''}
		</div>
		<div class="text-sm text-base">
			{item?.desc || ''}
		</div>
	</div>
{/snippet}
