<script lang="ts">
	import { page } from '$app/stores';
	import { APP_NAME } from '$lib/core/services/app-environment-service';
	import {
		mdiAccount,
		mdiAccountGroupOutline,
		mdiAccountOutline,
		mdiAccountTieOutline,
		mdiBriefcaseAccount,
		mdiBriefcaseAccountOutline,
		mdiBusMarker,
		mdiCalendarAccountOutline,
		mdiFormatListBulleted,
		mdiHomeOutline,
		mdiHomeVariant,
		mdiMapMarkerDistance,
		mdiMapMarkerPath,
		mdiPackageVariantClosed,
		mdiStore,
		mdiTableAccount,
		mdiTextBoxCheckOutline
	} from '$lib/core/services/app-icons-service';

	import { Button, IconCircle, isMobileScreen, navigate } from '@cloudparker/moldex.js';

	let active: string = $state('');
	let logoImgSrc = '/icons/web/icon-192.png';

	// Track active route from URL
	$effect(() => {
		active = $page.url.pathname;
	});

	function handleNavigate(route: string, ev: MouseEvent) {
		navigate(route, { event: ev });
	}
</script>

<div class="h-full flex flex-col">
	{#if isMobileScreen()}
		<div
			class="p-4 flex items-center gap-2 border-b border-base-300 dark:border-base-600 bg-gray-100 dark:bg-base-700"
		>
			<img src={logoImgSrc} alt="App Logo" class="w-8 h-8" />
			<h2 class="text-lg font-bold text-primary">{APP_NAME}</h2>
		</div>
	{/if}

	<!-- Navigation Buttons -->
	<div class="flex-1 overflow-y-auto py-2">
		<Button
			className={`w-full !text-start !justify-start !gap-4 rounded-none  ${active === '/restricted/home' ? 'bg-primary-50 dark:bg-base-700 font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/home', ev)}
		>
			<IconCircle iconPath={mdiHomeOutline} iconClassName="text-primary" />
			<div>Home</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start !gap-4 rounded-none  ${active.startsWith('/restricted/orders') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/orders', ev)}
		>
			<IconCircle iconPath={mdiTextBoxCheckOutline} iconClassName="text-primary" />
			<div>Orders</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start !gap-4 rounded-none  ${active.startsWith('/restricted/products') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/products', ev)}
		>
			<IconCircle iconPath={mdiPackageVariantClosed} iconClassName="text-primary" />
			<div>Products</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start !gap-4 rounded-none  ${active.startsWith('/restricted/customers') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/customers', ev)}
		>
			<IconCircle iconPath={mdiBriefcaseAccountOutline} iconClassName="text-primary" />
			<div>Customers</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start !gap-4 rounded-none  ${active.startsWith('/restricted/routes') ? 'bg-primary-50 dark:bg-base-700 font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/routes', ev)}
		>
			<IconCircle iconPath={mdiMapMarkerPath} iconClassName="text-primary" />
			<div>Routes</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start !gap-4 rounded-none  ${active.startsWith('/restricted/users') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/users', ev)}
		>
			<IconCircle iconPath={mdiAccountOutline} iconClassName="text-primary" />
			<div>Users</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start !gap-4 rounded-none  ${active.startsWith('/restricted/teams') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/teams', ev)}
		>
			<IconCircle iconPath={mdiAccountGroupOutline} iconClassName="text-primary" />
			<div>Teams</div>
		</Button>

		<!-- <Button
			className={`w-full !text-start !justify-start !gap-4 rounded-none  ${active.startsWith('/restricted/attendance') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/attendance', ev)}
		>
			<IconCircle iconPath={mdiCalendarAccountOutline} iconClassName="text-primary" />
			<div>Attendance</div>
		</Button> -->

		<Button
			className={`w-full !text-start !justify-start !gap-4 rounded-none  ${active.startsWith('/restricted/visits') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/visits', ev)}
		>
			<IconCircle iconPath={mdiBusMarker} iconClassName="text-primary" />
			<div>Tour Visits</div>
		</Button>
		<!-- <Button
			className={`w-full !text-start !justify-start !gap-4 rounded-none  ${active.startsWith('/restricted/activities') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/activities', ev)}
		>
			<IconCircle iconPath={mdiTableAccount} iconClassName="text-primary" />
			<div>Activities</div>
		</Button> -->

		<Button
			className={`w-full !text-start !justify-start rounded-none  ${active.startsWith('/restricted/attributes') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/attributes', ev)}
		>
			<IconCircle iconPath={mdiFormatListBulleted} iconClassName="text-primary" />
			<div>Attributes</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start rounded-none  ${active.startsWith('/restricted/roles') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/roles', ev)}
		>
			<IconCircle iconPath={mdiAccountTieOutline} iconClassName="text-primary" />
			<div>Roles</div>
		</Button>
	</div>
</div>

