import { isMobileScreen, openDeleteConfirmDialog, openDialog, openLoadingDialog, showErrorToast, showSuccessToast } from "@cloudparker/moldex.js";
import type { AgentDataModel, } from "../types/agent-types";
import AgentEditDialog from "../components/agent-edit-dialog.svelte";
import { deleteAgent, syncAgents } from "./agent-service";
import AgentDetailsDialog from "../components/agent-details-dialog.svelte";


export async function openAgentEditDialog(agent?: AgentDataModel) {
    let res = await openDialog<AgentDataModel>({
        bodyComponent: AgentEditDialog,
        props: { agent },
        scrollable: false,
        hasHeader: true,
        hasFooter: true,
        hasTitle: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        title: agent?._id ? 'Edit Agent' : 'Create Agent',
        hasFooterOkButton: true,
        hasFooterCloseButton: true,
        cancelable:false,
        targetFormId: 'agent-edit-form'
    });

    return res;

}

export async function openAgentDeleteDialog(agent: AgentDataModel) {

    if (agent && agent._id && (await openDeleteConfirmDialog({}))) {
        let loading = await openLoadingDialog({});
        try {
            await deleteAgent(agent._id!);
            await syncAgents();
            showSuccessToast();
        } catch (error) {
            console.error('Error on delete agent.');
            console.error(error);
            showErrorToast();
        }
        loading.closeDialog();
        return agent;
    }
}

export async function openAgentDetailsDialog(agentId: string) {
    let res = await openDialog({
        bodyComponent: AgentDetailsDialog,
        props: {
            agentId
        },
        hasHeader: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        hasTitle: true,
        title: 'Agent',
    });

    return res;
}