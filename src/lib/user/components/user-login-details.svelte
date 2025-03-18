<script lang="ts">
	import type { FirebaseAuthClaimsType, firebaseAuthUserIdentityType } from "$lib/auth/auth-types";
	import { getAuthUser, getFirebaseAuthClaims, showSignoutUI } from "$lib/auth/services/auth-service.svelte";
	import { mdiLogout } from "$lib/core/services/app-icons-service";
	import { Button, Icon, Spinner, TextDate } from "@cloudparker/moldex.js";
	import { onMount } from "svelte";

	

	// export let title = 'Login';

	let claims: FirebaseAuthClaimsType | null = null;
	let user: firebaseAuthUserIdentityType | null = null;

	async function handleSignout() {
		await showSignoutUI();
	}

	function handleReady() {
		claims = getFirebaseAuthClaims();
		user = getAuthUser();
	}

    onMount(() => {
        handleReady()
    })
</script>

<!-- <ClaimsReady on:ready={handleReady}></ClaimsReady> -->

<div>
	<!-- <h6 class="">{title}</h6> -->
	{#if claims}
		<table class="text-sm my-4 table-auto">
			<tbody>
				<tr>
                    <td>Login UID</td>
                    <td >{claims?.user_id || ''}</td>
                </tr>
				{#if claims?.phone || claims?.phone_number}
					<tr><td>Phone number</td><td>{claims?.phone || claims?.phone_number || '-'}</td></tr>
				{:else if claims?.email}
					<tr><td>Email</td><td>{claims?.email || '-'}</td></tr>
				{/if}
				
				<!-- {#if user}
					<tr>
						<td>Registration Date</td>
						<td>
							<TextDate input={user?.metadata.creationTime}></TextDate>
						</td>
					</tr>
					<tr>
						<td>Last Login Date</td>
						<td> <TextDate input={user?.metadata.lastSignInTime}></TextDate></td>
					</tr>
				{/if} -->
			</tbody>
		</table>
		<div class="flex justify-end">
            <Button appearance="border-primary" onClick={handleSignout}>
                <Icon path={mdiLogout}  sizeClassName="h-[16px] w-[16px]"/>
				<span class="">Signout</span>
            </Button>
			
		</div>
	{:else}
		<div>
			<Spinner />
		</div>
	{/if}
</div>

<style>
	td:nth-child(1) {
		width: 180px;
        height: 36px;
		color: var(--color-base-400)
	}
	td:nth-child(2) {
		
		color: var(--color-base-500)
	}
</style>
