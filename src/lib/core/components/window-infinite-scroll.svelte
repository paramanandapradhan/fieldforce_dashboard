<script lang="ts">
	import { BROWSER } from 'esm-env';

	type Props = {
		triggerDistance?: number;
		side?: 'top' | 'bottom';
		loadMore: () => void;
	};

	let { triggerDistance = 500, side = 'bottom', loadMore }: Props = $props();

	let scrollY = $state(0);
	let isTrigger = $state(false);

	$effect(() => {
		if (!BROWSER) return;

		const handleScroll = () => {
			if (!BROWSER) return;

			const bodyHeight = document.body.scrollHeight - window.innerHeight;
			const scrollDistance = side === 'top' ? scrollY : bodyHeight - scrollY;

			if (side === 'top') {
				if (scrollDistance < triggerDistance && !isTrigger) {
					isTrigger = true;
					loadMore();
				} else if (scrollDistance >= triggerDistance) {
					isTrigger = false;
				}
			} else {
				if (scrollDistance < triggerDistance && !isTrigger) {
					isTrigger = true;
					loadMore();
				} else if (scrollDistance >= triggerDistance) {
					isTrigger = false;
				}
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:window bind:scrollY />
