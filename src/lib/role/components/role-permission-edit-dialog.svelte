<script lang="ts">
	import { showErrorToast, type DialogExports } from '@cloudparker/moldex.js';
	import { syncRoles, updateRole } from '../role-service';
	import type {
		FeatureWithScope,
		RoleDataModel,
		RoleScopes
	} from '../role-types';
	import RolePermissionList from './role-permission-list.svelte';

	type Props = {
		role?: RoleDataModel;
	};
	let { role, closeDialog, setOkEnabled, setOkSpinner }: DialogExports & Props = $props();

	let scp: RoleScopes = $state({});

	function handleScopeChange(features: FeatureWithScope[]) {
		if (features && Array.isArray(features)) {
			scp = features.reduce((acc: RoleScopes, feature: FeatureWithScope) => {
				if (feature._id && feature.scope) {
					acc[feature._id] = feature.scope;
				}
				return acc;
			}, {});
		}
	}

	async function handleSubmit(ev: Event) {
		ev.preventDefault();

		if (role) {
			role.scp = scp || {};
			if (role && role._id) {
				try {
					setOkEnabled(false);
					setOkSpinner(true);
					let id = await updateRole(role._id, { scp });
					if (id) {
						await syncRoles();
						closeDialog(role);
					}
				} catch (error) {
					console.error(error);
					showErrorToast();
				} finally {
					setOkEnabled(true);
					setOkSpinner(false);
				}
			}
		}
	}
</script>

<form id="role-permission-edit-form" onsubmit={handleSubmit}>
	<div class="px-6">
		<RolePermissionList role={role!} onScopeChange={handleScopeChange} />
	</div>
</form>
