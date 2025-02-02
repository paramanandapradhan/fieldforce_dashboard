<script lang="ts">
	import { Icon, sort } from '@cloudparker/moldex.js';
	import { ADMIN_ROLE_ID } from '../role-service';
	import { FeatureScopeEnum, type FeatureWithScope, type RoleDataModel } from '../role-types';
	import { FEATURES_LIST } from '../feature-service';
	import { mdiInformationVariantCircleOutline } from '$lib/core/services/app-icons-service';

	type Props = {
		role: RoleDataModel;
		onScopeChange: (features: FeatureWithScope[]) => void;
	};

	let { role, onScopeChange }: Props = $props();

	let features: FeatureWithScope[] = $derived.by(() => {
		let result: FeatureWithScope[] = [];
		if (role) {
			result = JSON.parse(JSON.stringify(FEATURES_LIST));
		} else {
			result = [];
		}
		result = sort({ array: result, field: 'name' });

		let scope = role.scp || {};

		if (result?.length && role && scope) {
			if (role._id === ADMIN_ROLE_ID) {
				result.forEach((f) => (f.scope = FeatureScopeEnum.FULL));
			} else {
				result.forEach((f) => {
					if (scope && f._id) {
						let scp = scope[f._id];
						f.scope = scp || FeatureScopeEnum.NONE;
					}
				});
			}
		}
		return result;
	});

	function handleChange(ev: Event, feature: FeatureWithScope) {
		// console.log(ev);
		feature.scope = (ev.target as HTMLInputElement).value as FeatureScopeEnum;
		onScopeChange && onScopeChange($state.snapshot(features));
	}
</script>

<div>
	{#if features?.length}
		<div><h6 class="text-base font-bold">Permissions</h6></div>
		<table class="table-auto w-full mt-6">
			<thead>
				<tr class="text-left">
					<th>Feature Name </th>
					<th>None</th>
					<th>Read</th>
					<th>Write</th>
					<th>Full</th>
				</tr>
			</thead>
			<tbody>
				{#each features as feature}
					<tr class="border-b hover:bg-base-50" role="radiogroup">
						<td class="lh-1">
							<div class="flex items-center gap-1">
								<span>
									{feature.name}
								</span>
								<span>
									<Icon path={mdiInformationVariantCircleOutline} className="!w-4 !h-4" />
								</span>
							</div>
						</td>
						<td class=" ">
							<div class="form-check">
								<input
									type="radio"
									id="scope_{feature._id}_none"
									name="scope_{feature._id}"
									value={FeatureScopeEnum.NONE}
									checked={feature.scope === FeatureScopeEnum.NONE}
									onchange={(ev) => handleChange(ev, feature)}
								/>
							</div>
						</td>
						<td class=" ">
							<div class="form-check">
								<input
									type="radio"
									id="scope_{feature._id}_read"
									name="scope_{feature._id}"
									value={FeatureScopeEnum.READ}
									checked={feature.scope === FeatureScopeEnum.READ}
									onchange={(ev) => handleChange(ev, feature)}
								/>
							</div>
						</td>
						<td class=" ">
							<div class="form-check">
								<input
									type="radio"
									id="scope_{feature._id}_write"
									name="scope_{feature._id}"
									value={FeatureScopeEnum.WRITE}
									checked={feature.scope === FeatureScopeEnum.WRITE}
									onchange={(ev) => handleChange(ev, feature)}
								/>
							</div>
						</td>
						<td class=" ">
							<div class="form-check">
								<input
									type="radio"
									id="scope_{feature._id}_full"
									name="scope_{feature._id}"
									value={FeatureScopeEnum.FULL}
									checked={feature.scope === FeatureScopeEnum.FULL}
									onchange={(ev) => handleChange(ev, feature)}
								/>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<div class="flex-center">
			<span class="small grey p-3">No Permissions defined!</span>
		</div>
	{/if}
</div>
