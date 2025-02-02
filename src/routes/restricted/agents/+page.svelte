<script lang="ts">
	import AgentEditDialog from '$lib/agent/components/agent-edit-dialog.svelte';
	import AgentList from '$lib/agent/components/agent-list.svelte';
	import { openAgentEditDialog } from '$lib/agent/services/agent-ui-service';
	import type { AgentDataModel } from '$lib/agent/types/agent-types';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import { mdiAccount } from '$lib/core/services/app-icons-service';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import {
		Button,
		ButtonMenu,
		ContentArea,
		Drawer,
		goBack,
		isMobileScreen,
		Navbar,
		navigate,
		openDialog,
		Sidebar
	} from '@cloudparker/moldex.js';
	import type { Snippet } from 'svelte';

	let drawerRef: Drawer;
	let defaultAuthMenus: any[] = [
		{
			title: 'Profile',
			iconPath: mdiAccount
		}
	];

	let authMenus = $derived.by(() => {
		return [...defaultAuthMenus];
	});

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleCreateAgent() {
		let res: AgentDataModel = await openAgentEditDialog();
		if (res?._id) {
			// open agent view page
			navigate('/restricted/agents/view?agentId=' + res._id);
		}
	}
</script>

<svelte:head>
	<title>Agents : Hello AI</title>
</svelte:head>

{#snippet navbarRightSnippet()}
	<div class="flex items-center gap-2 h-full">
		<ButtonMenu menus={authMenus}></ButtonMenu>
	</div>
{/snippet}

<div class="min-h-full">
	<AppNavbar hasLogo hasTitle hasMore={isMobileScreen()} onMore={handleMore} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r ">
		<RestrictedDrawer />
	</Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main class="">
				<div class="p-4 md:p-8 flex items-center justify-between">
					<h1 class="text-lg md:text-xl font-black text-base-800 dark:text-base-300">Agents</h1>
				</div>
				<div class="mx-4 md:mx-8 mb-6 md:mb-8">
					<div class="bg-white dark:bg-base-700 rounded-2xl md:rounded-3xl p-4 md:p-6">
						<p
							class="text-sm md:text-base text-base-500 dark:text-base-300 font-light leading-relaxed"
						>
							Our AI-powered voice agent is an advanced, customizable solution designed to enhance
							user interactions through seamless voice communication. Equipped with a dynamic
							knowledge base that can handle domain-specific, general, and custom information, the
							agent adapts to various industries and needs. It supports multiple languages,
							including English, Spanish, French, German, Mandarin Chinese, and Hindi, with natural,
							high-quality voices available in male, female, and non-binary options. The agent can
							perform tasks such as answering queries, booking appointments, processing
							transactions, and providing personalized recommendations. With flexible pricing plans
							and a focus on security and privacy, this voice agent ensures a superior and
							user-friendly experience for businesses and their customers.
						</p>
					</div>
				</div>
				<div class="mx-4 md:mx-8 mt-8 md:mt-16 mb-4 flex justify-center md:justify-end">
					<Button
						appearance="border-primary"
						onClick={handleCreateAgent}
						label="Create Agent"
						className="w-full md:w-auto"
					/>
				</div>
				<div class="mx-4 md:mx-8 mt-4 mb-6 md:mb-8">
					<h3 class="text-md md:text-lg text-base font-bold text-base-800 dark:text-base-300">
						Active Agents
					</h3>
				</div>
				<div class="mx-4 md:mx-8">
					<AgentList />
				</div>
				<div class="mx-4 md:mx-8 !h-8">
					<div></div>
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>

