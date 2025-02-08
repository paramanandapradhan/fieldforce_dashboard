<script lang="ts">
	import type { UserDataModel } from '$lib/user/user-types';
	import { BROWSER } from 'esm-env';
	import { mdiAccountOutline } from '$lib/core/services/app-icons-service';
	import {
		ButtonDropdown,
		ButtonMenu,
		Icon,
		mdiChevronDown,
		TextAwait
	} from '@cloudparker/moldex.js';
	import { getUser } from '../user-service';

	type Props = {
		width?: string;
		input?: string;
		dropDownIconColor?: string;
		dropDownIconSize?: string;
		hideName?: boolean;
		hideIcon?: boolean;
		iconPath?: string;
		iconColor?: string;
		iconSize?: string;
		hideDropdown?: boolean;
		itemClass?: string;
	};

	let {
		width = '140px',
		input,

		hideName = false,
		hideIcon = false,
		iconPath = mdiAccountOutline,

		hideDropdown = false,
		itemClass = ''
	}: Props = $props();

	let userPromise: any = $state();

	function prepareUser(..._: any) {
		if (input) {
			userPromise = getUser(input);
		}
	}

	$effect(() => {
		prepareUser(input);
	});
</script>

<span class={'flex items-center ' + itemClass}>
	{#if !hideIcon}
		<span class:pe-1={!hideName}>
			<Icon path={iconPath} />
		</span>
	{/if}
	{#if !hideName}
		<span class="ellipsis" style={`max-width: ${width}`}>
			<TextAwait input={userPromise} key="name" />
		</span>
	{/if}
	{#await userPromise then user}
		{#if user && !hideDropdown}
			<!-- <ButtonMenu className=" " iconPath={mdiChevronDown}  /> -->
		{/if}
	{/await}
</span>
