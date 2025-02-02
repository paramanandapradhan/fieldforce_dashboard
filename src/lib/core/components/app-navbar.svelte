<script lang="ts">
	import { ButtonMenu, goBack, goHome, Navbar, openDialog } from '@cloudparker/moldex.js';
	import type { NavbarProps } from '@cloudparker/moldex.js';
	import { APP_NAME } from '../services/app-environment-service';
	import { type Snippet } from 'svelte';
	import { mdiAccount, mdiAccountCircle } from '../services/app-icons-service';
	import { goto } from '$app/navigation';
	import AuthSwitchAccountDialog from '$lib/auth/components/auth-switch-account-dialog.svelte';
	import { signout } from '$lib/auth/services/auth-service.svelte';
	import ButtonTheme from './button-theme.svelte';

	type Props = {};

	let {
		hasMore,
		hasBack,
		disabledLogo,
		logoImgSrc = '/icons/web/icon-192.png',
		className,
		hasLogo,
		hasTitle,
		titleClassName = 'text-primary !font-black',
		title = APP_NAME,
		...props
	}: Props & NavbarProps = $props();

	let defaultAuthMenus: any[] = [
		{
			id: 'admin',
			title: 'Admin',
			iconPath: mdiAccount,
			url: '/admin/skus'
		},
		{
			id: 'switch_acount',
			title: 'Switch Account',
			iconPath: mdiAccount
		},
		{
			id: 'profile',
			title: 'Profile',
			iconPath: mdiAccount,
			url: '/restricted/profile'
		}
	];

	let authMenus = $derived.by(() => {
		return [...defaultAuthMenus];
	});

	async function handleMenu(ev: any, menu: any) {
		switch (menu.id) {
			case 'switch_account':
				handleSitchAccount();
				break;
			case 'profile':
				goto('/restricted/profile');
				break;
		}
		if (menu?.url) {
			goto(menu.url);
		}
	}

	async function handleSitchAccount() {
		let res = await openDialog({ component: AuthSwitchAccountDialog });
	}
</script>

{#snippet rightSnippet()}
	{#if !hasBack}
	<div class="h-full flex gap-1">
		<ButtonTheme iconClassName="text-base-500" />
		<ButtonMenu
			className="h-full rounded-none !px-2"
			menus={authMenus}
			iconPath={mdiAccountCircle}
			iconClassName="text-base-500"
			onMenu={(ev, menu) => handleMenu(ev, menu as any)}
		/>
	</div>
	{/if}
{/snippet}

<Navbar
	{hasMore}
	{hasBack}
	{className}
	{hasLogo}
	{logoImgSrc}
	{hasTitle}
	{title}
	{titleClassName}
	rightSnippet={rightSnippet as Snippet}
	onBack={goBack}
	onLogo={goHome}
	{disabledLogo}
	{...props}
/>
