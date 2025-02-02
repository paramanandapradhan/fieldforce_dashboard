<script lang="ts">
	import { CallTypeEnum } from '../call-types';

	type Props = {
		input?: string;
	};

	let { input }: Props = $props();

	function getCallTypeFullName(type: string | undefined): string {
		switch (type) {
			case CallTypeEnum.PHONE:
				return 'Phone';
			case CallTypeEnum.CALL:
				return 'Call';
			case CallTypeEnum.CHAT:
				return 'Chat';
			default:
				return 'Unknown';
		}
	}
</script>

<span>{getCallTypeFullName(input)}</span>
