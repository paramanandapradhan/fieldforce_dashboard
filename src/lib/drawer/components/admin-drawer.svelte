<script lang="ts">
	import { mdiCash, mdiFaceAgent, mdiTagOutline } from '$lib/core/services/app-icons-service';

	import { Button, IconCircle, mdiPhone, navigate } from '@cloudparker/moldex.js';

	function handleSkus(ev: MouseEvent) {
		navigate('/admin/skus', { event: ev });
	}

	

</script>

<div>
	<Button className="w-full !text-start !justify-start !gap-4" onClick={handleSkus}>
		<IconCircle
			iconPath={mdiFaceAgent}
			circleClassName="!w-8 !h-8"
			iconClassName="!w-4 !h-4 text-primary"
		/>
		<div>SKUs</div>
	</Button>
	<!-- <Button className="w-full !text-start !justify-start !gap-4" onClick={handlePhoneNumber}>
		<IconCircle
			iconPath={mdiPhone}
			circleClassName="!w-8 !h-8"
			iconClassName="!w-4 !h-4 text-primary"
		/>
		<div>Phone Numbers</div>
	</Button>
	<Button className="w-full !text-start !justify-start !gap-4" onClick={handleCallHistory}>
		<IconCircle
			iconPath={mdiPhone}
			circleClassName="!w-8 !h-8"
			iconClassName="!w-4 !h-4 text-primary"
		/>
		<div>Call History</div>
	</Button>
	
	<Button className="w-full !text-start !justify-start !gap-4" onClick={handleBilling}>
		<IconCircle
			iconPath={mdiCash}
			circleClassName="!w-8 !h-8"
			iconClassName="!w-4 !h-4 text-primary"
		/>
		<div>Billing</div>
	</Button>

	<Button className="w-full !text-start !justify-start" onClick={handleAttribute}>
		<IconCircle
			iconPath={mdiTagOutline}
			circleClassName="!w-8 !h-8"
			iconClassName="!w-4 !h-4 text-primary"
		/>
		<div>Attributes</div>
	</Button> -->
	<!-- <Button className="w-full !text-start !justify-start" onClick={handleRoles}>
		<IconCircle iconPath={mdiShieldKeyOutline} />
		<div>Roles</div>
	</Button> -->
	
</div>
