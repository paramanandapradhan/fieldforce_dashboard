<script lang="ts">
	import {
		ComboboxField,
		sort,
		type ComboboxFieldProps,
		type InputFieldProps
	} from '@cloudparker/moldex.js';
	import { getAllSuppotedLangs } from '../services/tts-lang-service';

	type Props = {
		value?: string | string[] | null;
	};

	let { value = $bindable(null), ...props }: ComboboxFieldProps & InputFieldProps & Props =
		$props();

	// let items = $state(getAllSuppotedLangs());
</script>

<ComboboxField bind:value items={['English']} {...props} />
