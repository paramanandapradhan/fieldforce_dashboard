<script lang="ts">
	import ImgFile from '$lib/file/components/file-img.svelte';

	export let input: string | undefined;
	export let imgClass: string = '';
</script>

<div class="ratio ratio-1x1">
	<div>
		<ImgFile
			{input}
			fallbackUrl="/imgs/image-placeholder.svg"
			alt="Org"
			imgClass="full object-fit-cover {imgClass}"
		/>
	</div>
</div>
