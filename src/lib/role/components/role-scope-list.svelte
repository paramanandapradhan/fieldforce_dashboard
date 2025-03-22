<script lang="ts">
	import { Button, Icon, sort } from '@cloudparker/moldex.js';
	import { FEATURES_LIST } from '../feature-service';
	import { FeatureScopeEnum, type FeatureWithScope, type RoleDataModel } from '../role-types';
	import { ADMIN_ROLE_ID } from '../role-service';
	import {
		mdiAccountGroupOutline,
		mdiCheck,
		mdiCircleSmall,
		mdiInformationVariantCircleOutline
	} from '$lib/core/services/app-icons-service';

	type Props = {
		role?: RoleDataModel;
		showAlterPermission: boolean;
		showAlterUser: boolean;
		onAlterPermission?: () => void;
		onShowRoleUsers?: () => void;
	};

	let { role, showAlterPermission, showAlterUser, onAlterPermission, onShowRoleUsers }: Props =
		$props();

	let features: FeatureWithScope[] = $derived.by(() => {
		let result: FeatureWithScope[] = [];
		if (role) {
			result = JSON.parse(JSON.stringify(FEATURES_LIST));
		} else {
			result = [];
		}
		result = sort({ array: result, field: 'name' });
		if (result?.length && role && role.scp) {
			if (role._id === ADMIN_ROLE_ID) {
				result.forEach((f) => (f.scope = FeatureScopeEnum.FULL));
			} else {
				result.forEach((f) => {
					if (role.scp && f._id) {
						let scope = role.scp[f._id];
						if (scope) {
							f.scope = scope;
						}
					}
				});
			}
		}
		return result.filter((f) => f.scope && f.scope !== FeatureScopeEnum.NONE);
	});

	async function handleShowRoleUsers() {
		onShowRoleUsers && onShowRoleUsers();
	}

	function handleAlterPermission() {
		onAlterPermission && onAlterPermission();
	}
</script>

<div>
	{#if features?.length}
		<div><h6 class="font-bold text-base dark:text-base-400">Permissions</h6></div>
		<table class="table-auto w-full mt-6">
			<thead>
				<tr class="text-base-500 dark:text-base-400 text-left">
					<th>Feature Name </th>
					<th>None</th>
					<th>Read</th>
					<th>Write</th>
					<th>Full</th>
				</tr>
			</thead>
			<tbody>
				{#each features as feature}
					<tr class="border-b hover:bg-base-50 dark:hover:bg-base-700">
						<td class="dark:text-base-400">
							<div class="flex items-center gap-1">
								<span>
									{feature.name}
								</span>
								<span>
									<Icon path={mdiInformationVariantCircleOutline} className="!w-4 !h-4" />
								</span>
							</div>
						</td>
						<td class="">
							<Icon path={feature.scope === FeatureScopeEnum.NONE ? mdiCheck : mdiCircleSmall} />
						</td>
						<td class=" ">
							<Icon path={feature.scope === FeatureScopeEnum.READ ? mdiCheck : mdiCircleSmall} />
						</td>
						<td class=" ">
							<Icon path={feature.scope === FeatureScopeEnum.WRITE ? mdiCheck : mdiCircleSmall} />
						</td>
						<td class=" ">
							<Icon path={feature.scope === FeatureScopeEnum.FULL ? mdiCheck : mdiCircleSmall} />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<div class="flex-center">
			<span class="text-sm text-base-400 p-4">No permissions defined!</span>
		</div>
	{/if}

	<div class="flex align-center gap-2 mt-8">
		<div>
			{#if showAlterUser}
				<Button onClick={handleShowRoleUsers} appearance="border-base">
					<Icon path={mdiAccountGroupOutline}></Icon>
					<span class="pe-1">Users</span>
				</Button>
			{/if}
		</div>
		<div class="flex-grow-1"></div>
		<div>
			{#if showAlterPermission}
				<Button
					appearance="border-base"
					onClick={handleAlterPermission}
					disabled={role?._id === ADMIN_ROLE_ID}
					title={role?._id === ADMIN_ROLE_ID ? 'Admin permission can not be altered.' : ''}
				>
					Alter Permissions
				</Button>
			{/if}
		</div>
	</div>
</div>
