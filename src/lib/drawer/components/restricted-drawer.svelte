<script lang="ts">
	import { page } from '$app/stores';
	import { APP_NAME } from '$lib/core/services/app-environment-service';
	import {
		mdiAccountCircle,
		mdiCash,
		mdiFaceAgent,
		mdiFormatListBulleted,
		mdiHomeVariant,
		mdiPackageVariantClosed,
		mdiStore,
		mdiTagOutline,
		mdiTextBoxCheckOutline
	} from '$lib/core/services/app-icons-service';

	import { Button, IconCircle, isMobileScreen, mdiPhone, navigate } from '@cloudparker/moldex.js';

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
			class="p-4 flex items-center gap-2 border-b border-base-300 dark:border-base-600 bg-white dark:bg-base-800"
		>
			<img src={logoImgSrc} alt="App Logo" class="w-8 h-8" />
			<h2 class="text-lg font-bold text-primary">{APP_NAME}</h2>
		</div>
	{/if}

	<!-- Navigation Buttons -->
	<div class="flex-1 overflow-y-auto py-2">
		<Button
			className={`w-full !text-start !justify-start !gap-4 ${active === '/restricted/home' ? 'bg-primary-50' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/home', ev)}
		>
			<IconCircle
				iconPath={mdiHomeVariant}
				circleClassName="!w-8 !h-8"
				iconClassName="!w-4 !h-4 text-primary"
			/>
			<div>Home</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start !gap-4 ${active.startsWith('/restricted/retailers') ? 'bg-primary-50' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/retailers', ev)}
		>
			<IconCircle
				iconPath={mdiStore}
				circleClassName="!w-8 !h-8"
				iconClassName="!w-4 !h-4 text-primary"
			/>
			<div>Retailers</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start !gap-4 ${active.startsWith('/restricted/products') ? 'bg-primary-50 ' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/products', ev)}
		>
			<IconCircle
				iconPath={mdiPackageVariantClosed}
				circleClassName="!w-8 !h-8"
				iconClassName="!w-4 !h-4 text-primary"
			/>
			<div>Products</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start !gap-4 ${active.startsWith('/restricted/orders') ? 'bg-primary-50 ' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/orders', ev)}
		>
			<IconCircle
				iconPath={mdiTextBoxCheckOutline}
				circleClassName="!w-8 !h-8"
				iconClassName="!w-4 !h-4 text-primary"
			/>
			<div>Orders</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start !gap-4 ${active.startsWith('/restricted/users') ? 'bg-primary-50 ' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/users', ev)}
		>
			<IconCircle
				iconPath={mdiAccountCircle}
				circleClassName="!w-8 !h-8"
				iconClassName="!w-4 !h-4 text-primary"
			/>
			<div>Users</div>
		</Button>

		<Button
			className={`w-full !text-start !justify-start ${active.startsWith('/restricted/attributes') ? 'bg-primary-50 ' : ''}`}
			onClick={(ev) => handleNavigate('/restricted/attributes', ev)}
		>
			<IconCircle
				iconPath={mdiFormatListBulleted}
				circleClassName="!w-8 !h-8"
				iconClassName="!w-4 !h-4 text-primary"
			/>
			<div>Attributes</div>
		</Button>
	</div>
</div>
