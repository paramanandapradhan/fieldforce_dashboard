<script lang="ts">
	import type { UserDataModel } from '$lib/user/user-types';
	import { TextAwait } from '@cloudparker/moldex.js';
	import { getUser } from '../user-service';

	type Props = {
		input: string;
	};

	let { input }: Props = $props();

	let userPromise: Promise<UserDataModel | null> = $derived.by(() => {
		return getUser(input);
	});
</script>

<span><TextAwait input={userPromise} key="desc" /></span>
