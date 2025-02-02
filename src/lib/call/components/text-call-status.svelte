<script lang="ts">
	import { CallStatusEnum, CallTypeEnum } from '../call-types';

	type Props = {
		input?: string;
	};

	let { input }: Props = $props();

	function getCallstatusFullName(type: string | undefined): string {
		switch (type) {
			case CallStatusEnum.CONNECTED:
				return 'Connected';
			case CallStatusEnum.ENDED:
				return 'Ended';
			case CallStatusEnum.HOLD:
				return 'Hold';
			case CallStatusEnum.RINGING:
				return 'Ringing';
			default:
				return 'Unknown';
		}
	}
</script>

<span>{getCallstatusFullName(input)}</span>
