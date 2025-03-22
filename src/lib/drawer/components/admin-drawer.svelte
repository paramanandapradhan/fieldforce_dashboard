<script lang="ts">
	import { page } from '$app/stores';
	import {
		mdiCash,
		mdiFaceAgent,
		mdiFormatListBulleted,
		mdiTagOutline
	} from '$lib/core/services/app-icons-service';

	import { Button, IconCircle, mdiPhone, navigate } from '@cloudparker/moldex.js';

	let active: string = $state('');

 
	function handleNavigate(route: string, ev: MouseEvent) {
		navigate(route, { event: ev });
	}
	
	$effect(() => {
		active = $page.url.pathname;
	});
</script>

<div>
	<Button
		className={`w-full !text-start !justify-start rounded-none  ${active.startsWith('/restricted/attributes') ? 'bg-primary-50 dark:bg-base-700  font-bold' : ''}`}
		onClick={(ev) => handleNavigate('/restricted/attributes', ev)}
	>
		<IconCircle iconPath={mdiFormatListBulleted} iconClassName="text-primary" />
		<div>Attributes</div>
	</Button>
	 
</div>
