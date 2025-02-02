<script lang="ts">
	import { BROWSER } from 'esm-env';
	import type { OrgDataModel } from '../org-types';
	import { openOrgEditDialog } from '../org-ui-service';
	import AuthUserReady from '$lib/auth/components/auth-user-ready.svelte';
	import { ripple, Spinner, TextCountry, TextCountryState } from '@cloudparker/moldex.js';
	import { getOrg } from '../org-service';

	export let input: string | undefined;

	let org: OrgDataModel;
	let isReady: boolean = false;

	async function loadOrg(force?: boolean) {
		if (input && isReady) {
			org = await getOrg(input);
		}
	}

	function handleReady() {
		// console.log('ready');
		isReady = true;
		loadOrg(true);
	}

	function prepareOrg(..._: any) {
		loadOrg(true);
	}

	async function handleEditOrg() {
		let res = await openOrgEditDialog({ org, title: 'Update Business' });
		if (res) {
			loadOrg(true);
		}
	}

	$: BROWSER && prepareOrg(input);
</script>

<AuthUserReady onReady={handleReady} />
{#if org}
	<div class=" ">
		<div class="text-end">
			<button
				type="button"
				class="btn btn-sm btn-outline-primary"
				use:ripple
				on:click={handleEditOrg}
			>
				Edit
			</button>
		</div>
		<div>
			<table class="table table-sm table-borderless">
				<tbody>
					<tr>
						<td>Business Name</td>
						<td>
							<span class="bold">
								{org?.name || '-'}
							</span>
						</td>
					</tr>
					<tr>
						<td>Description</td>
						<td>
							<span>
								{org?.desc || '-'}
							</span>
						</td>
					</tr>
					<tr>
						<td>Owner Name</td>
						<td>
							<span>
								{org.ownerName || ''}
							</span>
						</td>
					</tr>
					<tr>
						<td>Owner Email</td>
						<td> {org.ownerEmail || '-'}</td>
					</tr>
					<tr>
						<td>Owner Phone</td>
						<td> {org.ownerPhone || '-'}</td>
					</tr>
					<tr>
						<td>Country</td>
						<td> <TextCountry input={org.country} /> </td>
					</tr>
					<tr>
						<td>State</td>
						<td> <TextCountryState input={org.state} /> </td>
					</tr>
					<tr>
						<td>City</td>
						<td> {org.city || '-'}</td>
					</tr>
					<tr>
						<td>Address</td>
						<td> {org.address || '-'}</td>
					</tr>
					<tr>
						<td>Currency </td>
						<td> {org?.pref?.currency || '-'}</td>
					</tr>
					<tr>
						<td>Date Format</td>
						<td> {org?.pref?.dateFormat || '-'}</td>
					</tr>
					<tr>
						<td>
							<span> Tax Account </span>
							<br />
							<span class="grey small">(GST/VAT/PAN/ID)</span>
						</td>
						<td> {org.taxNo || '-'}</td>
					</tr>
				</tbody>
			</table>
			<p class="smaller grey fw-light">
				* Currently we are not allowing to change the Admin details. Please contact support for any
				changes.
			</p>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center">
		<Spinner />
	</div>
{/if}

<style>
	td:nth-child(1) {
		color: grey;
		width: 120px;
	}
</style>
