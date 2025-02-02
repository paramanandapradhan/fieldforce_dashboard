<script lang="ts">
	import {
		openLoadingDialog,
		showSuccessToast,
		showToast,
		TextareaField,
		TextField,
		type DialogExports
	} from '@cloudparker/moldex.js';
	import type { OrgDataModel } from '../org-types';
	import { createOrg, updateOrg } from '../org-service';
	import {
		getAuthUser,
		getFirebaseAuthUserEmail,
		getFirebaseAuthUserName,
		getFirebaseAuthUserPhoneNumber,
		refreshClaimDelay
	} from '$lib/auth/services/auth-service.svelte';

	type Props = {
		org?: OrgDataModel;
	};

	let { org, closeDialog, setResult }: Props & DialogExports = $props();

	let name = $state(org?.name ?? '');
	let desc = $state(org?.desc ?? '');
	let address = $state(org?.address ?? '');
	let city = $state(org?.city ?? '');
	let taxNo = $state(org?.taxNo ?? '');

	// let pref: OrgPreferenceDataModel = $state({
	// 	currency: '$',
	// 	dateFormat: 'DD/MM/YYYY',
	// 	...org.pref
	// });

	let isSubmiting = $state(false);

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		console.log('handleSubmit', isSubmiting);
		if (!isSubmiting) {
			isSubmiting = true;
			name = (name || '').trim();
			let newOid: string | null = null;
			// org.pref = pref;

			let payload: OrgDataModel = {
				name,
				desc,
				city,
				address
			};

			if (org?._id) {
				let loading = await openLoadingDialog({});
				newOid = await updateOrg(org?._id, payload);
				// if (newOid) {
				// 	await getCacheOrg(newOid, true);
				// }
				await loading.closeDialog();
			} else {
				if (payload.name) {
					let loading = await openLoadingDialog({
						cancelable: false,
						msg: 'Please Wait...<br/><span class="text-sm text-base-400">Organization registration will take around a minute!</span>',
						size: 'lg'
					});

					let phone = getFirebaseAuthUserPhoneNumber();
					let email = getFirebaseAuthUserEmail();
					let userName = getFirebaseAuthUserName() || '';

					if (!(email || phone) && !userName) {
						console.log('Admin name and Admin identity required to create org. Reload the page');
						showToast({ msg: 'Something went wrong! Reload the page.' });
						isSubmiting = false;
						return false;
					}

					payload.ownerName = userName;

					if (phone) {
						payload.phone = phone;
						payload.ownerPhone = phone;
					}
					if (email) {
						payload.email = email;
						payload.ownerEmail = email;
					}

					console.log(payload);
					try {
						newOid = await createOrg(payload);
						// await syncOrgs();
						await refreshClaimDelay(15000, true);

						console.log('After org created getAuthUser = ', getAuthUser());

						// First attempt to get the updated claim, sometime it will delay based on function start time.
						if (!getAuthUser()) {
							console.log('Not created yet! wait more time!');
							await refreshClaimDelay(15000, true);
						}
						// Second attempt
						if (!getAuthUser()) {
							console.log('Not created yet! wait more time!');
							await refreshClaimDelay(15000, true);
						}

						// third attempt
						if (!getAuthUser()) {
							console.log('Not created yet! wait more time!');
							await refreshClaimDelay(15000, true);
						}

						if (getAuthUser()) {
							showSuccessToast();
						}
					} catch (error) {
						console.error(error);
						showToast({ msg: 'Error on Registration!' });
					}
					loading.closeDialog();
				} else {
					showToast({ msg: 'Invalid Name' });
				}
			}

			if (newOid) {
				setResult(newOid);
				closeDialog();
			}
			isSubmiting = false;
		}
	}
</script>

<form id="org-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<h6 class="mt-5">Business Infromation</h6>
		<div class="my-3">
			<TextField
				name="name"
				label="Organization Name"
				bind:value={name}
				appearance="normal"
				maxlength={25}
				floatingLabel={false}
				required
				autofocus
			/>
		</div>

		<div class="my-3">
			<TextareaField
				name="desc"
				label="Description"
				bind:value={desc}
				appearance="normal"
				placeholder=" "
				floatingLabel={false}
				maxlength={250}
				rows={3}
			/>
		</div>

		<!-- <div class="my-3">
		<CountryDropdownField name="country" label="Country" bind:value={org.country} />
		</div>
		<div class="my-3">
			<CountryStateDropdownField
				name="state"
				label="State"
				country={org.country}
				bind:value={org.state}
			/>
		</div>  -->
		<div class="my-3">
			<TextField name="city" label="City" bind:value={city} maxlength={30} floatingLabel={false} />
		</div>
		<div class="my-3">
			<TextareaField
				name="address"
				label="Address"
				bind:value={address}
				placeholder=" "
				maxlength={250}
				rows={4}
				floatingLabel={false}
			/>
		</div>

		<!-- <div class="my-3">
		<CurrencyDropdownField label="Currency" bind:value={pref.currency} />
	</div>
	<div class="my-3">
		<DateformatDropdownField label="Date Format" bind:value={pref.dateFormat} />
	</div> -->

		<div class="my-3">
			<TextField name="taxNo" label="Business Tax Account" bind:value={taxNo} maxlength={20} />
		</div>
	</div>
</form>
