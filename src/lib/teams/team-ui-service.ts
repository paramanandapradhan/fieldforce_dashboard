import {
	getDialogSize,
	isMobileScreen,
	openDeleteConfirmDialog,
	openDialog,
	openLoadingDialog,
	showErrorToast,
	showSuccessToast,
	showToast
} from '@cloudparker/moldex.js';
import TeamEditDialog from './components/team-edit-dialog.svelte';
import type { TeamDataModel } from './team-type';
import { ADMIN_USER_ID } from '$lib/core/services/app-service';
import { deleteTeam, syncTeams } from './team-service';

export async function openTeamEditDialog(team?: TeamDataModel) {
	let res = openDialog({
		bodyComponent: TeamEditDialog,
		props: { team },
		hasTitle: true,
		hasHeader: true,
		title: team?._id ? 'Edit Team' : 'Add Team',
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		size: getDialogSize(),
		hasFooter: true,
		hasFooterCloseButton: true,
		hasFooterOkButton: true,
		footerOkButtonLable: 'Save',
		targetFormId: 'team-edit-form',
		scrollable: false,
	});
	return res;
}

export async function openTeamDeleteDialog(team: TeamDataModel) {
	if (team._id == ADMIN_USER_ID) {
		showToast({ msg: 'Can not delete the main Admin Staff!' });
		return;
	}
	if (team && team._id && (await openDeleteConfirmDialog({}))) {
		let loading = await openLoadingDialog({});
		try {
			await deleteTeam(team._id!);
			await syncTeams();
			showSuccessToast();
		} catch (error) {
			console.error('Error on delete Team.');
			console.error(error);
			showErrorToast();
		}
		loading.closeDialog();
		return team;
	}
}
