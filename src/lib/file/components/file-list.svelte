<script lang="ts">
	import { ButtonListItem, ButtonMenu } from '@cloudparker/moldex.js';
	import { getFile } from '../file-service';
	import type { FileDataModel } from '../file-type';
	import FileIconCircle from './file-icon-circle.svelte';
	import TextFileSize from './text-file-size.svelte';

	type Props = {
		input?: string[];
		onOpen: (file: FileDataModel) => void;
		onDelete: (file: FileDataModel) => void;
	};

	let { input, onOpen, onDelete }: Props = $props();

	let filesPromise = $derived.by(async () => {
		if (input) {
			return await Promise.all(
				input.map(async (id) => {
					let file = await getFile(id);
					return file;
				})
			);
		}
		return [];
	});

	function hanleMenu(ev: Event, menu: string, file: FileDataModel) {
		if (menu && file) {
			switch (menu) {
				case 'Open':
					openFile(file);
					break;
				case 'Delete':
					deleteFile(file);
					break;
			}
		}
	}

	function handleOpen(ev: any, file: FileDataModel | null) {
		if (file) {
			openFile(file);
		}
	}

	function openFile(file: FileDataModel) {
		if (file) {
			onOpen && onOpen(file);
		}
	}

	function deleteFile(file: FileDataModel) {
		if (file) {
			onDelete && onDelete(file);
		}
	}
</script>

{#await filesPromise then files}
	<div>
		{#each files || [] as file, index}
			<ButtonListItem on:click={(ev) => handleOpen(ev, file)}>
				<div class="flex-align-center gap-2">
					<div>
						<FileIconCircle input={file?._id} />
					</div>
					<div class="flex-grow-1">
						<div>{file?.name || ''}</div>
						<div class="text-sm text-base-400"><TextFileSize input={file?._id} /></div>
					</div>
					<div>
						<ButtonMenu
							menus={['Open', 'Delete']}
							onMenu={(ev, menu) => hanleMenu(ev, menu as string, file)}
						/>
					</div>
				</div>
			</ButtonListItem>
		{/each}
	</div>
{/await}
