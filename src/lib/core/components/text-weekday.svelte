<script lang="ts">
	type Props = {
		input: number;
	};

	let { input }: Props = $props();

	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
</script>

<span>{weekdays[input]}</span>
