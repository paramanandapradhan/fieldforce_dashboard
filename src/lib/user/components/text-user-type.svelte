<script lang="ts">
	import { UserTypeEnum } from '../user-service';

	type Props = {
		input: UserTypeEnum;
	};

	let { input }: Props = $props();

	let types = {
		u: 'User',
		c: 'Customer'
	};
</script>

<span>{types[input]} </span>
