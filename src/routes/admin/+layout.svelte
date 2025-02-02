<script lang="ts">
	import { syncAgents } from '$lib/agent/services/agent-service';
	import { syncAttributes } from '$lib/attribute/attribute-service';
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { syncPhones } from '$lib/phone/phone-service';
	import { syncRoles } from '$lib/role/role-service';
	import { syncUsers } from '$lib/user/user-service';
	import { onMount } from 'svelte';
	import '../../tailwind.css';
	import { syncKnowledges } from '$lib/knowledge/knowledge-service';
	import { syncActions } from '$lib/action/action-service';
	import { syncInvoices } from '$lib/invoice/invoice-service';
	import { syncPayments } from '$lib/payment/payment-service';
	

	let imgClassName: string = $state('opacity-0');

	let { children } = $props();

	let isReady = $state(false);

	function handleAuthUserReady() {
		isReady = true;
		syncUsers();
		syncRoles();
		syncAttributes();
		syncPhones();
		syncAgents();
		syncKnowledges();
		syncActions();
		syncInvoices();
		syncPayments()
		
	}
	onMount(() => {
		setTimeout(() => {
			imgClassName = 'opacity-100';
		}, 100);
	});
</script>

<AuthUserReady onReady={handleAuthUserReady} />
{#if isReady}
	{@render children()}
{:else}
	<div class="min-h-full flex items-center justify-center">
		<div>
			<img
				class="mx-auto h-12 w-auto transition-opacity duration-1000 {imgClassName}"
				src="/icons/web/icon-192.png"
				alt="App Logo"
			/>
		</div>
	</div>
{/if}
