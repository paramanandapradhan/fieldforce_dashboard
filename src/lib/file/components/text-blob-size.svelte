<script lang="ts">
	import { formatFileSize } from "$lib/core/services/app-utils-service";
	 
	 type Props ={
		input: File | Blob 
	 }

	 let {input }:Props = $props()
 
	let value = $derived(formatFileSize(input.size||0));
 
</script>

<span>{value || ''} </span>
