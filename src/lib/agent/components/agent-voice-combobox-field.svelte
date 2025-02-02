<script lang="ts">
	import {
		ComboboxField,
		type ComboboxFieldProps,
		type InputFieldProps
	} from '@cloudparker/moldex.js';
	import { getAllSuppotedTtsVoice } from '../services/tts-lang-service';

	type Props = {
		value?: string | string[] | null;
	};

	let { value = $bindable(null), ...props }: ComboboxFieldProps & InputFieldProps & Props =
		$props();

	let items = $state(getAllSuppotedTtsVoice());
</script>

<ComboboxField bind:value {items} {...props} />
