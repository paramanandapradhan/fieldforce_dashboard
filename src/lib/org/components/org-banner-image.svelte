<script lang="ts">
	import ImgFile from '$lib/file/components/file-img.svelte';

	type Props = { input: string; imgClass: string; className?: string };

	let { input, imgClass, className }: Props = $props();
</script>

<div class="aspect-video {className}">
	<div>
		<ImgFile
			{input}
			fallbackUrl="/imgs/image-placeholder.svg"
			alt="Org"
			imgClass="w-full h-full {imgClass}"
		/>
	</div>
</div>
