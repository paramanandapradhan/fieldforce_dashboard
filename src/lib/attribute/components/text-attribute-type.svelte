<script lang="ts">
	import { AttributeTypeEnum, getAttributeTypeConfig } from '$lib/attribute/attribute-service';
	import type { AttributeTypeConfig } from '../attribute-types';

	type Props = {
		input?: AttributeTypeEnum;
		emptyText?: string;
	};
	let { input, emptyText = '' }: Props = $props();

	let attributeType: AttributeTypeConfig | undefined = $derived.by(() => {
		if (input) {
			return getAttributeTypeConfig(input);
		}
	});
</script>

<span>
	{attributeType?.label || emptyText}
</span>
