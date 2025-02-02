<script lang="ts">
	import { TextCopy, TextDate } from '@cloudparker/moldex.js';
	import type { BaseDataModel } from '../types/app-types';
	import TextUser from '$lib/user/components/text-user.svelte';
	type Props = {
		data: BaseDataModel;
	};
	let { data }: Props = $props();
</script>

<div>
	<table class="table-auto text-sm font-light">
		<tbody>
			<tr>
				<td>_id</td>
				<td>
					<TextCopy
						input={data?._id || ''}
						buttonClassName="!px-2 !py-1 !mx-4"
						iconClassName="!w-4 !h-4 text-base-400"
					/>
				</td>
			</tr>
			{#if data?.cat}
				<tr>
					<td>Created Date</td>
					<td> <TextDate input={data?.cat} /></td>
				</tr>
			{/if}
			{#if data?.uat}
				<tr>
					<td>Updated Date</td>
					<td><TextDate input={data?.uat} /></td>
				</tr>
			{/if}
			{#if data?.cby}
				<tr>
					<td>Created By</td>
					<td><TextUser input={data?.cby} hideIcon /> </td>
				</tr>
			{/if}
			{#if data?.uby}
				<tr>
					<td>Updated By</td>
					<td> <TextUser input={data?.uby} hideIcon /> </td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>

<style>
	td:nth-child(1) {
		color: var(--color-base-400);
		width: 180px;
	}
	td:nth-child(2) {
		color: var(--color-base-500);
		width: 180px;
	}
</style>
