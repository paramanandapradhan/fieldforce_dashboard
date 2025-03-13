<script lang="ts">
	import { mdiCart, mdiCartOutline } from '$lib/core/services/app-icons-service';
	import { Button, Icon } from '@cloudparker/moldex.js';

	type Props = {
		totalQuantity?: number;
		onClick?: () => void;
	};

	let { totalQuantity = 0, onClick }: Props = $props();
</script>

<Button className="" {onClick}>
	<div class="relative">
		<div>
			<Icon path={totalQuantity ? mdiCart : mdiCartOutline} />
		</div>
		{#if totalQuantity}
			<div
				class="absolute -top-2 -right-3.5 bg-primary rounded-full text-white aspect-square w-5 flex items-center justify-center"
				style="font-size: 8px;"
			>
				<span>{totalQuantity}</span>
			</div>
		{/if}
	</div>
</Button>
