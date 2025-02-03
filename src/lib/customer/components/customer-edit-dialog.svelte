<script lang="ts">
	import { createUser, getUser, syncUsers, updateUser } from '$lib/user/user-service';
	import type { CustomerDataModel } from '$lib/user/user-types';
	import {
		CheckboxField,
		EmailField,
		PhoneField,
		showToast,
		TextareaField,
		TextField,
		type DialogExports
	} from '@cloudparker/moldex.js';

	export type CustomerProps = {
		customer?: CustomerDataModel;
	};

	let {
		customer = {},
		setOkEnabled,
		setOkSpinner,
		closeDialog,
		setResult
	}: DialogExports & CustomerProps = $props();

	// Customer Details
	let name = $state(customer?.name || '');
	let desc = $state(customer?.desc || '');
	let email = $state(customer?.email || '');
	let phone = $state(customer?.phone || '');
	let altPhone = $state(customer?.altPhone || '');
	let address = $state(customer?.address || '');
	let isActive = $state(customer?.isActive ?? true);
	let canPlaceOrder = $state(customer?.isActive ?? true);

	// Billing Fields
	let billingName = $state(customer?.billing?.name || '');
	let billingAddress = $state(customer?.billing?.address || '');
	let billingEmail = $state(customer?.billing?.email || '');
	let billingPhone = $state(customer?.billing?.phone || '');
	let billingTaxNo = $state(customer?.billing?.taxNo || '');

	// Delivery Fields
	let deliveryName = $state(customer?.delivery?.name || '');
	let deliveryAddress = $state(customer?.delivery?.address || '');
	let deliveryTaxNo = $state(customer?.delivery?.taxNo || '');
	let deliveryPhone = $state(customer?.delivery?.phone || '');
	let deliveryEmail = $state(customer?.delivery?.email || '');

	// Owner Fields
	let ownerName = $state(customer?.owner?.name || '');
	let ownerAddress = $state(customer?.owner?.address || '');
	let ownerPhone = $state(customer?.owner?.phone || '');
	let ownerEmail = $state(customer?.owner?.email || '');
	let ownerDob = $state(customer?.owner?.dob || '');

	// Master Fields
	let masterCustomerType = $state(customer?.master?.customerType || '');
	let masterCompany = $state(customer?.master?.company || '');
	let masterBranch = $state(customer?.master?.branch || '');
	let masterDistributor = $state(customer?.master?.distributor || '');
	let masterSm = $state(customer?.master?.sm || '');
	let masterTsm = $state(customer?.master?.tsm || '');
	let masterRoute = $state(customer?.master?.route || '');
	let masterType = $state(customer?.master?.type || '');
	let masterSubType = $state(customer?.master?.subType || '');
	let masterChain = $state(customer?.master?.chain || '');
	let masterClazz = $state(customer?.master?.clazz || '');
	let masterLabel = $state(customer?.master?.label || '');
	let masterExtId = $state(customer?.master?.extId || '');
	let masterCreditLimit = $state(customer?.master?.creditLimit || '');

	// Identity Fields
	let identityTaxNo = $state(customer?.identity?.taxNo || '');
	let identityAadharNo = $state(customer?.identity?.aadharNo || '');
	let identityPanNo = $state(customer?.identity?.panNo || '');
	let identityVoterId = $state(customer?.identity?.voterId || '');
	let identitySecurityCheck = $state(customer?.identity?.securityCheck || '');
	let identityDrivingLicence = $state(customer?.identity?.drivingLicence || '');
	let identityOtherNo = $state(customer?.identity?.otherNo || '');
	let identityOtherNoName = $state(customer?.identity?.otherNoName || '');

	// Geo Fields
	let geoCountry = $state(customer?.geo?.country || '');
	let geoState = $state(customer?.geo?.state || '');
	let geoCity = $state(customer?.geo?.city || '');
	let geoDistrict = $state(customer?.geo?.district || '');
	let geoLocality = $state(customer?.geo?.locality || '');
	let geoStreet = $state(customer?.geo?.street || '');
	let geoLandmark = $state(customer?.geo?.landmark || '');
	let geoPincode = $state(customer?.geo?.pincode || '');
	// Comma-separated string (e.g., "12.34, 56.78") for geo.location
	let geoLocation = $state(customer?.geo?.location ? customer.geo.location.join(', ') : '');

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		// Trim all the fields
		name = (name || '').trim();
		desc = (desc || '').trim();
		email = (email || '').trim();
		phone = (phone || '').trim();
		altPhone = (altPhone || '').trim();
		address = (address || '').trim();

		billingName = (billingName || '').trim();
		billingAddress = (billingAddress || '').trim();
		billingEmail = (billingEmail || '').trim();
		billingPhone = (billingPhone || '').trim();
		billingTaxNo = (billingTaxNo || '').trim();

		deliveryName = (deliveryName || '').trim();
		deliveryAddress = (deliveryAddress || '').trim();
		deliveryTaxNo = (deliveryTaxNo || '').trim();
		deliveryPhone = (deliveryPhone || '').trim();
		deliveryEmail = (deliveryEmail || '').trim();

		ownerName = (ownerName || '').trim();
		ownerAddress = (ownerAddress || '').trim();
		ownerPhone = (ownerPhone || '').trim();
		ownerEmail = (ownerEmail || '').trim();
		ownerDob = (ownerDob || '').trim();

		masterCustomerType = (masterCustomerType || '').trim();
		masterCompany = (masterCompany || '').trim();
		masterBranch = (masterBranch || '').trim();
		masterDistributor = (masterDistributor || '').trim();
		masterSm = (masterSm || '').trim();
		masterTsm = (masterTsm || '').trim();
		masterRoute = (masterRoute || '').trim();
		masterType = (masterType || '').trim();
		masterSubType = (masterSubType || '').trim();
		masterChain = (masterChain || '').trim();
		masterClazz = (masterClazz || '').trim();
		masterLabel = (masterLabel || '').trim();
		masterExtId = (masterExtId || '').trim();
		masterCreditLimit = (masterCreditLimit || '').trim();

		identityTaxNo = (identityTaxNo || '').trim();
		identityAadharNo = (identityAadharNo || '').trim();
		identityPanNo = (identityPanNo || '').trim();
		identityVoterId = (identityVoterId || '').trim();
		identitySecurityCheck = (identitySecurityCheck || '').trim();
		identityDrivingLicence = (identityDrivingLicence || '').trim();
		identityOtherNo = (identityOtherNo || '').trim();
		identityOtherNoName = (identityOtherNoName || '').trim();

		geoCountry = (geoCountry || '').trim();
		geoState = (geoState || '').trim();
		geoCity = (geoCity || '').trim();
		geoDistrict = (geoDistrict || '').trim();
		geoLocality = (geoLocality || '').trim();
		geoStreet = (geoStreet || '').trim();
		geoLandmark = (geoLandmark || '').trim();
		geoPincode = (geoPincode || '').trim();
		geoLocation = (geoLocation || '').trim();

		if (name) {
			setOkEnabled(false);
			setOkSpinner(true);

			let payload = {
				name,
				desc,
				email,
				phone,
				altPhone,
				address,
				isActive,
				canPlaceOrder,
				billing: {
					name: billingName,
					address: billingAddress,
					email: billingEmail,
					phone: billingPhone,
					taxNo: billingTaxNo
				},
				delivery: {
					name: deliveryName,
					address: deliveryAddress,
					email: deliveryEmail,
					phone: deliveryPhone,
					taxNo: deliveryTaxNo
				},
				owner: {
					name: ownerName,
					address: ownerAddress,
					email: ownerEmail,
					phone: ownerPhone,
					dob: ownerDob
				},
				master: {
					customerType: masterCustomerType,
					company: masterCompany,
					branch: masterBranch,
					distributor: masterDistributor,
					sm: masterSm,
					tsm: masterTsm,
					route: masterRoute,
					type: masterType,
					subType: masterSubType,
					chain: masterChain,
					clazz: masterClazz,
					label: masterLabel,
					extId: masterExtId,
					creditLimit: masterCreditLimit
				},
				identity: {
					taxNo: identityTaxNo,
					aadharNo: identityAadharNo,
					panNo: identityPanNo,
					voterId: identityVoterId,
					securityCheck: identitySecurityCheck,
					drivingLicence: identityDrivingLicence,
					otherNo: identityOtherNo,
					otherNoName: identityOtherNoName
				},
				geo: {
					country: geoCountry,
					state: geoState,
					city: geoCity,
					district: geoDistrict,
					locality: geoLocality,
					street: geoStreet,
					landmark: geoLandmark,
					pincode: geoPincode,
					location: geoLocation
						.split(',')
						.map((s) => parseFloat(s.trim()))
						.filter((n) => !isNaN(n))
				}
			};

			let id = null;
			if (!customer?._id) {
				id = await createUser(payload);
			} else {
				id = await updateUser(customer?._id, payload);
			}
			if (id) {
				await syncUsers();
				let customerResult = getUser(id);
				setResult(customerResult);
			}
			closeDialog();
		} else {
			showToast({ msg: 'Please fill the required fields' });
		}
	}
</script>

<!--
	Each card (with margin m-4) wraps its category.
	Inside each card a grid (1 column on mobile, 3 columns on md+ screens) holds the fields.
	The textarea fields are now placed in their own grid cell so they align as one column on larger screens.
  -->
<form id="customer-edit-form" on:submit={handleSubmit} class="space-y-6">
	<!-- Customer Details Card -->
	<div class="m-4 bg-white p-4 border rounded shadow">
		<h4 class="text-xl font-bold mb-4">Customer Details</h4>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<TextField
					name="name"
					label="Customer Name"
					maxlength={50}
					bind:value={name}
					required
					autofocus
				/>
			</div>
			<div>
				<TextField name="desc" label="Description" maxlength={100} bind:value={desc} />
			</div>
			<div>
				<EmailField name="email" label="Email" bind:value={email} />
			</div>
			<div>
				<PhoneField name="phone" label="Phone" bind:value={phone} dialCode="+91" />
			</div>
			<div>
				<TextField
					name="altPhone"
					label="Alternate Phone Number"
					bind:value={altPhone}
					maxlength={18}
				/>
			</div>

			<div class="">
				<!-- <input type="checkbox" bind:checked={isActive} id="active-checkbox" class="mr-2" />
				<label for="active-checkbox">Active</label> -->
			</div>
			<div>
				<TextareaField name="address" label="Address" bind:value={address} maxlength={300} />
			</div>
			<div></div>
			<div></div>
			<div>
				<div class="my-4">
					<CheckboxField name="isActive" label="Active" bind:value={isActive} />
				</div>
				<div class="my-4">
					<CheckboxField name="canPlaceOrder" label="Can Place Order" bind:value={canPlaceOrder} />
				</div>
			</div>
		</div>
	</div>

	<!-- Billing Details Card -->
	<div class="m-4 bg-white p-4 border rounded shadow">
		<h4 class="text-xl font-bold mb-4">Billing Details</h4>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<TextField
					name="billingName"
					label="Billing Name"
					bind:value={billingName}
					maxlength={80}
				/>
			</div>
			<div>
				<TextField
					name="billingEmail"
					label="Billing Email"
					bind:value={billingEmail}
					maxlength={80}
				/>
			</div>
			<div>
				<TextField
					name="billingPhone"
					label="Billing Phone"
					bind:value={billingPhone}
					maxlength={18}
				/>
			</div>
			<div>
				<TextField
					name="billingTaxNo"
					label="Billing Tax No / GST No"
					bind:value={billingTaxNo}
					maxlength={50}
				/>
			</div>
			<div>
				<TextareaField
					name="billingAddress"
					label="Billing Address"
					bind:value={billingAddress}
					maxlength={300}
				/>
			</div>
		</div>
	</div>

	<!-- Delivery Details Card -->
	<div class="m-4 bg-white p-4 border rounded shadow">
		<h4 class="text-xl font-bold mb-4">Delivery Details</h4>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<TextField
					name="deliveryName"
					label="Delivery Name"
					bind:value={deliveryName}
					maxlength={80}
				/>
			</div>
			<div>
				<TextField
					name="deliveryEmail"
					label="Delivery Email"
					bind:value={deliveryEmail}
					maxlength={80}
				/>
			</div>
			<div>
				<TextField
					name="deliveryPhone"
					label="Delivery Phone"
					bind:value={deliveryPhone}
					maxlength={18}
				/>
			</div>
			<div>
				<TextField
					name="deliveryTaxNo"
					label="Delivery Tax No"
					bind:value={deliveryTaxNo}
					maxlength={50}
				/>
			</div>
			<div>
				<TextareaField
					name="deliveryAddress"
					label="Delivery Address"
					bind:value={deliveryAddress}
					maxlength={300}
				/>
			</div>
		</div>
	</div>

	<!-- Owner Details Card -->
	<div class="m-4 bg-white p-4 border rounded shadow">
		<h4 class="text-xl font-bold mb-4">Owner Details</h4>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<TextField name="ownerName" label="Owner Name" bind:value={ownerName} maxlength={80} />
			</div>
			<div>
				<EmailField name="ownerEmail" label="Owner Email" bind:value={ownerEmail} />
			</div>
			<div>
				<PhoneField name="ownerPhone" label="Owner Phone" bind:value={ownerPhone} dialCode="+91" />
			</div>
			<div>
				<TextField name="ownerDob" label="Owner Date of Birth" type="date" bind:value={ownerDob} />
			</div>
			<div>
				<TextareaField
					name="ownerAddress"
					label="Owner Address"
					bind:value={ownerAddress}
					maxlength={300}
				/>
			</div>
		</div>
	</div>

	<!-- Master Details Card -->
	<div class="m-4 bg-white p-4 border rounded shadow">
		<h4 class="text-xl font-bold mb-4">Master Details</h4>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<TextField
					name="masterCustomerType"
					label="Customer Type"
					bind:value={masterCustomerType}
					maxlength={50}
				/>
			</div>
			<div>
				<TextField name="masterCompany" label="Company" bind:value={masterCompany} maxlength={80} />
			</div>
			<div>
				<TextField name="masterBranch" label="Branch" bind:value={masterBranch} maxlength={80} />
			</div>
			<div>
				<TextField
					name="masterDistributor"
					label="Distributor"
					bind:value={masterDistributor}
					maxlength={80}
				/>
			</div>
			<div>
				<TextField name="masterRoute" label="Route" bind:value={masterRoute} maxlength={80} />
			</div>
			<div>
				<TextField name="masterSm" label="SM" bind:value={masterSm} maxlength={80} />
			</div>
			<div>
				<TextField name="masterTsm" label="TSM" bind:value={masterTsm} maxlength={80} />
			</div>
			<div>
				<TextField name="masterType" label="Type" bind:value={masterType} maxlength={50} />
			</div>
			<div>
				<TextField
					name="masterSubType"
					label="Sub Type"
					bind:value={masterSubType}
					maxlength={50}
				/>
			</div>
			<div>
				<TextField name="masterChain" label="Chain" bind:value={masterChain} maxlength={50} />
			</div>
			<div>
				<TextField name="masterClazz" label="Class" bind:value={masterClazz} maxlength={50} />
			</div>
			<div>
				<TextField name="masterLabel" label="Label" bind:value={masterLabel} maxlength={50} />
			</div>
			<div>
				<TextField name="masterExtId" label="External ID" bind:value={masterExtId} maxlength={50} />
			</div>
			<div>
				<TextField
					name="masterCreditLimit"
					label="Credit Limit"
					bind:value={masterCreditLimit}
					maxlength={50}
				/>
			</div>
		</div>
	</div>

	<!-- Identity Details Card -->
	<div class="m-4 bg-white p-4 border rounded shadow">
		<h4 class="text-xl font-bold mb-4">Identity Details</h4>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<TextField name="identityTaxNo" label="Tax No" bind:value={identityTaxNo} maxlength={50} />
			</div>
			<div>
				<TextField name="identityPanNo" label="PAN No" bind:value={identityPanNo} maxlength={50} />
			</div>
			<div>
				<TextField
					name="identityAadharNo"
					label="Aadhar No"
					bind:value={identityAadharNo}
					maxlength={50}
				/>
			</div>
			<div>
				<TextField
					name="identityVoterId"
					label="Voter ID"
					bind:value={identityVoterId}
					maxlength={50}
				/>
			</div>
			<div>
				<TextField
					name="identityDrivingLicence"
					label="Driving Licence"
					bind:value={identityDrivingLicence}
					maxlength={50}
				/>
			</div>
			<div>
				<TextField
					name="identitySecurityCheck"
					label="Security Check"
					bind:value={identitySecurityCheck}
					maxlength={50}
				/>
			</div>
			<div>
				<TextField
					name="identityOtherNo"
					label="Other Number"
					bind:value={identityOtherNo}
					maxlength={50}
				/>
			</div>
			<div>
				<TextField
					name="identityOtherNoName"
					label="Other Number Name"
					bind:value={identityOtherNoName}
					maxlength={50}
				/>
			</div>
		</div>
	</div>

	<!-- Geo Details Card -->
	<div class="m-4 bg-white p-4 border rounded shadow">
		<h4 class="text-xl font-bold mb-4">Geographical Details</h4>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<TextField name="geoCountry" label="Country" bind:value={geoCountry} maxlength={50} />
			</div>
			<div>
				<TextField name="geoState" label="State" bind:value={geoState} maxlength={50} />
			</div>
			<div>
				<TextField name="geoCity" label="City" bind:value={geoCity} maxlength={50} />
			</div>
			<div>
				<TextField name="geoDistrict" label="District" bind:value={geoDistrict} maxlength={50} />
			</div>
			<div>
				<TextField name="geoLocality" label="Locality" bind:value={geoLocality} maxlength={50} />
			</div>
			<div>
				<TextField name="geoStreet" label="Street" bind:value={geoStreet} maxlength={50} />
			</div>
			<div>
				<TextField name="geoLandmark" label="Landmark" bind:value={geoLandmark} maxlength={50} />
			</div>
			<div>
				<TextField name="geoPincode" label="Pincode" bind:value={geoPincode} maxlength={20} />
			</div>
			<div>
				<TextField
					name="geoLocation"
					label="Location (comma separated lat,long)"
					bind:value={geoLocation}
					maxlength={50}
				/>
			</div>
		</div>
	</div>
</form>
