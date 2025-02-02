<script lang="ts">
	import { getAgent } from '../services/agent-service';
	import { Button, Icon, IconCircle, Progressbar } from '@cloudparker/moldex.js';
	import type { AgentDataModel } from '../types/agent-types';
	import { onMount } from 'svelte';
	import { mdiAccountVoice, mdiFaceAgent, mdiPause, mdiPlay } from '$lib/core/services/app-icons-service';

	type Props = {
		agentId: string;
	};

	let { agentId }: Props = $props();
	let agent: AgentDataModel | null = $state(null);
	let audio: HTMLAudioElement | null = null;
	let isPlaying = $state(false);
	let progress = $state(0);

	const demoAudio = {
		Male: 'https://cloud.google.com/static/text-to-speech/docs/audio/en-IN-Journey-D.wav',
		Female: 'https://cloud.google.com/static/text-to-speech/docs/audio/en-IN-Journey-F.wav'
	};

	async function loadAgent() {
		if (agentId) {
			agent = await getAgent(agentId);
			if (agent && agent.gender) {
				setupAudio(agent.gender);
			}
		}
	}

	function setupAudio(gender: string) {
		if (audio) {
			audio.pause();
			audio = null;
		}
		if (demoAudio[gender as keyof typeof demoAudio]) {
			audio = new Audio(demoAudio[gender as keyof typeof demoAudio]);
			audio.addEventListener('timeupdate', updateProgress);
			audio.addEventListener('ended', resetAudio);
		}
	}

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

	onMount(() => {
		loadAgent();
		return () => {
			if (audio) {
				audio.pause();
				audio = null;
			}
		};
	});
</script>

<div
	class="bg-white dark:bg-base-700 min-h-[100px] shadow items-center rounded-lg text-base-800 dark:text-base-300 p-6"
>
	<div class="text-lg font-semibold">Voice Sample</div>
	{#if agent && agent.gender}
		<div class="mt-4 flex gap-4 items-center space-y-2">
			<div>
				<IconCircle iconPath={mdiAccountVoice} />
			</div>
			<div>
				<Button appearance="base" className="rounded-full" onClick={togglePlay}>
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
			<div class="w-72 bg-gray-200 rounded-full h-1">
				<div class="bg-primary h-1 rounded-full" style="width: {progress}%;"></div>
			</div>
		</div>
	{:else}
		<div class="text-base-500">No audio available for this agent.</div>
	{/if}
</div>
