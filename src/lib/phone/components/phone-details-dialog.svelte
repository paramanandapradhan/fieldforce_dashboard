<script lang="ts">
	import PhoneDetails from "./phone-details.svelte";

	

	type Props = {
		phoneId: string;
	};

	let { phoneId }: Props = $props();
</script>

<div class="h-full">
	<PhoneDetails {phoneId}/>
</div>
