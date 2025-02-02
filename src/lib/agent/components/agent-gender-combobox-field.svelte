<script lang="ts">
	import {
		Button,
		ComboboxField,
		Icon,
		Progressbar,
		type ComboboxFieldProps,
		type InputFieldProps
	} from '@cloudparker/moldex.js';
	import { getAllSuppotedGenders } from '../services/tts-lang-service';
	import { onMount } from 'svelte';
	import { mdiPause, mdiPlay } from '$lib/core/services/app-icons-service';

	type Props = {
		value?: string | string[] | null;
	};

	let { value = $bindable(null), ...props }: ComboboxFieldProps & InputFieldProps & Props =
		$props();

	let items = $state(getAllSuppotedGenders());
	let audio: HTMLAudioElement | null = null;
	let isPlaying = $state(false);
	let progress = $state(0);

	const demoAudio = {
		Male: 'https://cloud.google.com/static/text-to-speech/docs/audio/en-IN-Journey-D.wav',
		Female: 'https://cloud.google.com/static/text-to-speech/docs/audio/en-IN-Journey-F.wav'
	};

	function togglePlay() {
		if (!audio) return;
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		isPlaying = !isPlaying;
	}

	function updateProgress() {
		if (audio) {
			progress = (audio.currentTime / audio.duration) * 100;
		}
	}

	function resetAudio() {
		if (audio) {
			isPlaying = false;
			progress = 0;
		}
	}

	$effect(() => {
		if (audio) {
			audio.pause();
			isPlaying = false;
			progress = 0;
		}
		if (value && demoAudio[value as keyof typeof demoAudio]) {
			audio = new Audio(demoAudio[value as keyof typeof demoAudio]);
			audio.addEventListener('timeupdate', updateProgress);
			audio.addEventListener('ended', resetAudio);
		}
	});

	onMount(() => {
		return () => {
			if (audio) {
				audio.pause();
				audio = null;
			}
		};
	});
</script>

<div>
	<ComboboxField bind:value {items} {...props} />

	{#if value && demoAudio[value as keyof typeof demoAudio]}
		<div class="my-2 border rounded-md">
			<div class=" my-2 text-sm text-center text-base-600">
				{value} Voice Sample
			</div>
			<div class="px-2 flex gap-2 items-center">
				<div class="flex items-center">
					<Button appearance="none" onClick={togglePlay}>
						{#if isPlaying}
							<div title="Pause">
								<Icon path={mdiPause} />
							</div>
						{:else}
							<div title="Play">
								<Icon path={mdiPlay} />
							</div>
						{/if}
					</Button>
				</div>
				<!-- <div>
				<Progressbar
					value={progress}
					className="w-full bg-gray-200 rounded-full h-2.5"
				></Progressbar>
			</div> -->
				<div class="w-full bg-gray-200 rounded-full h-1">
					<div class="bg-primary h-1 rounded-full" style="width: {progress}%;"></div>
				</div>
			</div>
		</div>
	{/if}
</div>
