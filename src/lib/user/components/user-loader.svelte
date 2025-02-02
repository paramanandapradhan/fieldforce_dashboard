<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getUser } from '../user-service';
	import type { UserDataModel } from '../user-types';

	type Props = {
		userId?: string;
		user?: UserDataModel | null;
		onLoad?: (user: UserDataModel | null | undefined) => void;
		children?: Snippet;
		placeholder?: Snippet;
	};

	let { userId, user = $bindable(), onLoad, children, placeholder }: Props = $props();

	let userPromise = $derived.by(async () => {
		if (userId) {
			return await getUser(userId);
		}
	});

	$effect(() => {
		userPromise?.then((res?: UserDataModel | null) => {
			user = res;
			onLoad && onLoad(res);
		});
	});
</script>

{#await userPromise}
	{#if placeholder}
		{@render placeholder()}
	{/if}
{:then user}
	{#if children}
		{@render children()}
	{/if}
{/await}
