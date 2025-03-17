<script lang="ts">
	import { AttributeTypeEnum } from '$lib/attribute/attribute-service';
	import AttributeComboboxField from '$lib/attribute/components/attribute-combobox-field.svelte';
	import {
		createUser,
		CUSTOMER_SUBTYPES,
		getUser,
		syncUsers,
		updateUser,
		UserSubtypeEnum,
		UserTypeEnum
	} from '$lib/user/user-service';
	import { type CustomerDataModel } from '$lib/user/user-types';
	import {
		CheckboxField,
		ComboboxField,
		DateField,
		EmailField,
		NumberField,
		PhoneField,
		showToast,
		TextareaField,
		TextField,
		type DialogExports
	} from '@cloudparker/moldex.js';
	import UserComboboxField from './user-combobox-field.svelte';
	import RouteComboboxField from '$lib/route/components/route-combobox-field.svelte';
	import CustomerComboboxField from './customer-combobox-field.svelte';

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
	let address = $state(customer?.address || '');
	let isActive = $state(customer?.isActive ?? true);
	let canPlaceOrder = $state(customer?.isActive ?? true);
	let categories = $state(customer?.categories || []);
	let subtype = $state(customer?.subtype || UserSubtypeEnum.USER_SUBTYPE_CUSTOMER_CONSUMER);

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

	let masterCompany = $state(customer?.master?.company || '');
	let masterBranch = $state(customer?.master?.branch || '');
	let masterSeller = $state(customer?.master?.seller || '');
	let masterSm = $state(customer?.master?.sm || '');
	let masterTsm = $state(customer?.master?.tsm || '');
	let masterRoute = $state(customer?.master?.route || '');
	let masterChain = $state(customer?.master?.chain || '');
	let masterClazz = $state(customer?.master?.clazz || '');
	let masterLabel = $state(customer?.master?.label || '');
	let masterExtId = $state(customer?.master?.extId || '');
	let masterCreditLimit = $state(customer?.master?.creditLimit || '');
	let doj = $state(customer?.doj || '');

	// Geo Fields
	let geoCountry = $state(customer?.geo?.country || '');
	let geoState = $state(customer?.geo?.state || '');
	let geoCity = $state(customer?.geo?.city || '');
	let geoArea = $state(customer?.geo?.area || '');
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
		address = (address || '').trim();
		subtype = subtype || UserSubtypeEnum.USER_SUBTYPE_CUSTOMER_CONSUMER;

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
		ownerDob = ownerDob || '';

		categories = categories || [];
		masterCompany = (masterCompany || '').trim();
		masterBranch = (masterBranch || '').trim();
		masterSeller = (masterSeller || '').trim();
		masterSm = (masterSm || '').trim();
		masterTsm = (masterTsm || '').trim();
		masterRoute = (masterRoute || '').trim();
		masterChain = (masterChain || '').trim();
		masterClazz = (masterClazz || '').trim();
		masterLabel = (masterLabel || '').trim();
		masterExtId = (masterExtId || '').trim();
		masterCreditLimit = masterCreditLimit || '';

		geoCountry = (geoCountry || '').trim();
		geoState = (geoState || '').trim();
		geoCity = (geoCity || '').trim();
		geoArea = (geoArea || '').trim();
		geoDistrict = (geoDistrict || '').trim();
		geoLocality = (geoLocality || '').trim();
		geoStreet = (geoStreet || '').trim();
		geoLandmark = (geoLandmark || '').trim();
		geoPincode = (geoPincode || '').trim();
		geoLocation = (geoLocation || '').trim();

		if (name) {
			setOkEnabled(false);
			setOkSpinner(true);

			let payload:CustomerDataModel = {
				name,
				desc,
				email,
				phone,
				address,
				isActive,
				canPlaceOrder,
				type: UserTypeEnum.USER_TYPE_CUSTOMER,
				subtype,
				doj,
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
					company: masterCompany,
					branch: masterBranch,
					seller: masterSeller,
					sm: masterSm,
					tsm: masterTsm,
					route: masterRoute,
					chain: masterChain,
					clazz: masterClazz,
					label: masterLabel,
					extId: masterExtId,
					creditLimit: masterCreditLimit
				},

				geo: {
					country: geoCountry,
					state: geoState,
					city: geoCity,
					area: geoArea,
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
<div class="pb-32">
	<form id="customer-edit-form" onsubmit={handleSubmit} class="space-y-6">
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
				<div></div>
				<div>
					<EmailField name="email" label="Email" bind:value={email} />
				</div>
				<div>
					<PhoneField name="phone" label="Phone" bind:value={phone} dialCode="+91" />
				</div>
				<div></div>

				<div>
					<ComboboxField
						name="subtype"
						label="Customer Type"
						items={CUSTOMER_SUBTYPES}
						bind:value={subtype}
					/>
				</div>

				<div>
					<AttributeComboboxField
						attributeType={AttributeTypeEnum.CUSTOMER_CATEGORY}
						name="categories"
						label="Customer Categories"
						bind:value={categories}
						createButtonLabel="Add Category"
						hasCheckbox={true}
						multiple={true}
					/>
				</div>

				<div></div>
				<div>
					<div class="">
						<TextareaField name="address" label="Address" bind:value={address} maxlength={300} />
					</div>

					<div class="my-4">
						<CheckboxField
							name="canPlaceOrder"
							label="Can Place Order"
							bind:value={canPlaceOrder}
						/>
					</div>
					<div class="my-4">
						<CheckboxField name="isActive" label="Active" bind:value={isActive} />
					</div>
				</div>
			</div>
		</div>

		<!-- Master Details Card -->
		<div class="m-4 bg-white p-4 border rounded shadow">
			<h4 class="text-xl font-bold mb-4">Master Details</h4>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<UserComboboxField
						userType={UserTypeEnum.USER_TYPE_USER}
						userSubtype={UserSubtypeEnum.USER_SUBTYPE_USER_SM}
						name="masterSm"
						label="SM"
						bind:value={masterSm}
						createButtonLabel="Add SM"
					/>
				</div>
				<div>
					<UserComboboxField
						userType={UserTypeEnum.USER_TYPE_USER}
						userSubtype={UserSubtypeEnum.USER_SUBTYPE_USER_TSM}
						name="masterTsm"
						label="TSM"
						bind:value={masterTsm}
						createButtonLabel="Add TSM"
					/>
				</div>
				<div>
					<CustomerComboboxField
						userType={UserTypeEnum.USER_TYPE_USER}
						userSubtype={UserSubtypeEnum.USER_SUBTYPE_CUSTOMER_SELLER}
						name="masterSeller"
						label="Seller"
						bind:value={masterSeller}
						createButtonLabel="Add Seller"
					/>
				</div>
				<div>
					<RouteComboboxField
						name="masterRoute"
						label="Route"
						bind:value={masterRoute}
						createButtonLabel="Add Route"
					/>
				</div>
				<div>
					<AttributeComboboxField
						attributeType={AttributeTypeEnum.CUSTOMER_CLASS}
						name="masterClazz"
						label="Class"
						bind:value={masterClazz}
						createButtonLabel="Add Class"
					/>
				</div>
				<div>
					<AttributeComboboxField
						attributeType={AttributeTypeEnum.CUSTOMER_CHAIN}
						name="masterChain"
						label="Chain"
						bind:value={masterChain}
						createButtonLabel="Add Chain"
					/>
				</div>

				<div>
					<TextField
						name="masterCompany"
						label="Company"
						bind:value={masterCompany}
						maxlength={80}
					/>
				</div>

				<div>
					<TextField name="masterLabel" label="Label" bind:value={masterLabel} maxlength={50} />
				</div>
				<div>
					<TextField
						name="masterExtId"
						label="External ID"
						bind:value={masterExtId}
						maxlength={50}
					/>
				</div>
				<div>
					<NumberField
						name="masterCreditLimit"
						label="Credit Limit"
						bind:value={masterCreditLimit}
					/>
				</div>
				<div>
					<DateField name="doj" label="Date Of Joining" bind:value={doj} />
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
						name="billingTaxNo"
						label="Billing Tax No / GST No"
						bind:value={billingTaxNo}
						maxlength={50}
					/>
				</div>
				<div></div>
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
				<div></div>

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
					<DateField
						name="ownerDob"
						label="Owner Date of Birth"
						type="date"
						bind:value={ownerDob}
					/>
				</div>
				<div></div>
				<div>
					<EmailField name="ownerEmail" label="Owner Email" bind:value={ownerEmail} />
				</div>
				<div>
					<PhoneField
						name="ownerPhone"
						label="Owner Phone"
						bind:value={ownerPhone}
						dialCode="+91"
					/>
				</div>
				<div></div>
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

		<!-- Geo Details Card -->
		<div class="m-4 bg-white p-4 border rounded shadow">
			<h4 class="text-xl font-bold mb-4">Geographical Details</h4>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<AttributeComboboxField
						attributeType={AttributeTypeEnum.COUNTRY}
						name="geoCountry"
						label="Country "
						bind:value={geoCountry}
						createButtonLabel="Add Country"
					/>
				</div>
				<div>
					<AttributeComboboxField
						attributeType={AttributeTypeEnum.STATE}
						name="geoState"
						label="State "
						bind:value={geoState}
						createButtonLabel="Add State"
						parent={geoCountry}
					/>
				</div>
				<div>
					<AttributeComboboxField
						attributeType={AttributeTypeEnum.DISTRICT}
						name="geoDistrict"
						label="District "
						bind:value={geoDistrict}
						createButtonLabel="Add District"
						parent={geoState}
					/>
				</div>
				<div>
					<AttributeComboboxField
						attributeType={AttributeTypeEnum.CITY}
						name="geoCity"
						label="City "
						bind:value={geoCity}
						createButtonLabel="Add City"
						parent={geoState}
					/>
				</div>
				<div>
					<AttributeComboboxField
						attributeType={AttributeTypeEnum.AREA}
						name="geoArea"
						label="Area "
						bind:value={geoArea}
						createButtonLabel="Add Area"
						parent={geoCity}
					/>
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
</div>
