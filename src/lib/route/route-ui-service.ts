import { isMobileScreen, openDeleteConfirmDialog, openDialog, openLoadingDialog, showErrorToast, showSuccessToast } from "@cloudparker/moldex.js";
import type { RouteDataModel } from "./route-types";
import RouteEditDialog from "./components/route-edit-dialog.svelte";
import { deleteRoute, syncRoutes } from "./route-service";

export async function openRouteEditDialog(route?: RouteDataModel) {
    let res = await openDialog<RouteDataModel>({
        bodyComponent: RouteEditDialog,
        props: { route },
        scrollable: true,
        hasHeader: true,
        hasFooter: true,
        hasTitle: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        title: 'Create Route',
        hasFooterOkButton: true,
        hasFooterCloseButton: true,
        targetFormId: 'route-edit-form'
    });

    return res;

}

export async function openRouteDeleteDialog(route?: RouteDataModel) {

    if (route && route._id && (await openDeleteConfirmDialog({}))) {
        let loading = await openLoadingDialog({});
        try {
            await deleteRoute(route._id!);
            await syncRoutes();
            showSuccessToast();
        } catch (error) {
            console.error('Error on delete agent.');
            console.error(error);
            showErrorToast();
        }
        loading.closeDialog();
        return route;
    }
}