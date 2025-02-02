<script lang="ts">
	import {
		ComboboxField,
		sort,
		type ComboboxFieldProps,
		type InputFieldProps
	} from '@cloudparker/moldex.js';

	type Props = {
		value?: string | string[] | null;
	};

	let { value = $bindable(null), ...props }: ComboboxFieldProps & InputFieldProps & Props =
		$props();

	let items = $state(["India", "US"]);
</script>

<ComboboxField bind:value {items} {...props} />
