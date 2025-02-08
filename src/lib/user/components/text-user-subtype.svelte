<script lang="ts">
	import { UserSubtypeEnum } from '../user-service';

	type Props = {
		input?: UserSubtypeEnum;
	};

	let { input }: Props = $props();

	let types = {
		s: 'Staff',
		m: 'SM',
		t: 'TSM',
		d: 'Distributor',
		c: 'Consumer',
		r: 'Retailer'
	};
</script>

<span>{types[input || 'c']} </span>
