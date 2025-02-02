import {
	isMobileScreen,
	openDeleteConfirmDialog,
	openDialog,
	openLoadingDialog,
	showErrorToast,
	showSuccessToast
} from '@cloudparker/moldex.js';
import type { KnowledgeDataModel } from './knowledge-types';
import KnowledgeEditDialog from './components/knowledge-edit-dialog.svelte';
import { deleteKnowledge, syncKnowledges } from './knowledge-service';
import KnowledgeDetailsDialog from './components/knowledge-details-dialog.svelte';

export async function openKnowledgeEditDialog({
	agentId,
	knowledge
}: {
	agentId: string | undefined;
	knowledge?: KnowledgeDataModel;
}) {
	let res = openDialog({
		bodyComponent: KnowledgeEditDialog,
		props: { knowledge, agentId },
		hasTitle: true,
		hasHeader: true,
		title: 'Create knowledge',
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		size: isMobileScreen() ? 'full' : 'lg',
		hasFooter: true,
		hasFooterCloseButton: true,
		hasFooterOkButton: true,
		footerOkButtonLable: 'Save',
		targetFormId: 'knowledge-edit-form',
		cancelable: false
	});
	return res;
}

export async function openKnowledgeDeleteDialog(knowledge: KnowledgeDataModel) {
	if (knowledge?._id && (await openDeleteConfirmDialog({}))) {
		let loading = await openLoadingDialog({});
		try {
			await deleteKnowledge(knowledge._id!);
			await syncKnowledges();
			showSuccessToast();
		} catch (error) {
			console.error('Error on delete knowledge.');
			console.error(error);
			showErrorToast();
		}
		loading.closeDialog();
		return knowledge;
	}
}

export async function openknowledgeDetailsDialog({
	agentId,
	knowledge
}: {
	agentId: string | undefined;
	knowledge?: KnowledgeDataModel;
}) {
	let res = await openDialog({
		bodyComponent: KnowledgeDetailsDialog,
		props: {
			agentId,
			knowledge
		},
		hasHeader: true,
		hasHeaderBack: isMobileScreen(),
		hasHeaderClose: !isMobileScreen(),
		hasTitle: true,
		title: 'Agent Knowledge',
		
	});

	return res;
}
