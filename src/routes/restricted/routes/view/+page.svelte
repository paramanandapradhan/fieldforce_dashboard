<script lang="ts">
	import {
		Button,
		ContentArea,
		Drawer,
		goBack,
		IconCircle,
		isMobileScreen,
		openLoadingDialog,
		screenSize,
		Sidebar
	} from '@cloudparker/moldex.js';
	import AppNavbar from '$lib/core/components/app-navbar.svelte';
	import BackgroundGradient from '$lib/core/components/background-gradient.svelte';
	import RestrictedDrawer from '$lib/drawer/components/restricted-drawer.svelte';
	import { page } from '$app/state';
	import { getRoute } from '$lib/route/route-service';
	import RouteDetails from '$lib/route/components/route-details.svelte';
	import { mdiMapMarkerPath } from '$lib/core/services/app-icons-service';
	import RoutePlanner from '$lib/route/components/route-planner.svelte';
	import { onMount } from 'svelte';
	import type { RouteDataModel } from '$lib/route/route-types';
	import { openUserPickerDialog } from '$lib/user/user-ui-service';
	import { getAllUsers, syncUsers, updateUser, UserTypeEnum } from '$lib/user/user-service';
	import type { CustomerDataModel } from '$lib/user/user-types';
	import CustomerTable from '$lib/user/components/customer-table.svelte';
	import RouteCustomerTable from '$lib/route/components/route-customer-table.svelte';
	import { openRouteEditDialog } from '$lib/route/route-ui-service';
	import RoutPlannerUserList from '$lib/route/components/rout-planner-user-list.svelte';
	import RouteCustomerList from '$lib/route/components/route-customer-list.svelte';

	let drawerRef: Drawer;

	let routeId: string = $state('');
	let route: RouteDataModel | null = $state(null);
	let routeCustomers: CustomerDataModel[] = $state([]);

	async function loadRoute() {
		if (routeId) {
			route = await getRoute(routeId);
		} else {
			route = null;
		}
	}

	async function loadRouteCustomers() {
		if (routeId) {
			let array = (await getAllUsers({
				type: UserTypeEnum.USER_TYPE_CUSTOMER,
				route: routeId
			})) as CustomerDataModel[];

			console.log('array', array);
			routeCustomers = array;
		} else {
			routeCustomers = [];
		}
	}

	function handleMore() {
		drawerRef && drawerRef.openDrawer();
	}

	async function handleEdit() {
		if (route) {
			let res = await openRouteEditDialog(route);
			if (res) {
				loadRoute();
			}
		}
	}

	function handleChange() {
		loadRoute();
		loadRouteCustomers();
	}

	async function handleAddCustomer() {
		let custId: string = (await openUserPickerDialog({
			userType: UserTypeEnum.USER_TYPE_CUSTOMER
		})) as string;
		if (custId && routeId) {
			let loader = await openLoadingDialog();
			await updateUser(custId, { 'master.route': routeId } as CustomerDataModel);
			await syncUsers();
			await loadRouteCustomers();
			await loader.closeDialog();
		}
	}

	onMount(() => {
		routeId = page.url.searchParams.get('routeId') || '';
		loadRoute();
		loadRouteCustomers();
	});
</script>

<div class="min-h-full">
	<AppNavbar title="VIEW ROUTE" hasLogo hasTitle hasBack={isMobileScreen()} onBack={goBack} />
	<Drawer bind:this={drawerRef} className="border-r"><RestrictedDrawer /></Drawer>
	<Sidebar className="border-r "><RestrictedDrawer /></Sidebar>
	<ContentArea className="md:pl-72">
		<BackgroundGradient>
			<main>
				<div class="p-4 flex items-center justify-between">
					<div><h1 class="text-xl font-black dark:text-base-200">Route View</h1></div>
					<div>
						<Button appearance="border-primary" onClick={handleEdit} label="Edit" />
					</div>
				</div>
				<div class="pb-32">
					{#if route != null}
						<div class="bg-white dark:bg-base-800 p-4 shadow rounded-lg m-4">
							<div class="flex md:flex-row flex-col gap-4">
								<div>
									<IconCircle
										iconPath={mdiMapMarkerPath}
										iconClassName="  text-primary"
										circleClassName=" "
									/>
								</div>
								<div>
									<RouteDetails {route} />
								</div>
							</div>
						</div>

						<div class="bg-white dark:bg-base-800 rounded-lg shadow p-4 m-4">
							<RoutePlanner {route} onChange={handleChange} />
						</div>
						<div class="bg-white dark:bg-base-800 rounded-lg shadow p-4 m-4">
							<div class="flex">
								<div class=" flex-grow">
									<h3 class="text-lg font-bold dark:text-base-200">Route Customers</h3>
								</div>
								<div>
									<Button appearance="base" onClick={handleAddCustomer}>Add Customer</Button>
								</div>
							</div>
							<div class="my-4">
								{#if screenSize.isSm || screenSize.isMd || screenSize.isXs}
									<RouteCustomerList customers={routeCustomers} onChange={handleChange} />
								{:else}
									<RouteCustomerTable customers={routeCustomers} onChange={handleChange} />
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</main>
		</BackgroundGradient>
	</ContentArea>
</div>
