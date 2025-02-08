import { isMobileScreen, openDialog } from "@cloudparker/moldex.js";
import type { RouteDataModel } from "./route-types";
import RouteEditDialog from "./components/route-edit-dialog.svelte";

export async function openRouteEditDialog(route?: RouteDataModel) {
    let res = await openDialog<RouteDataModel>({
        bodyComponent: RouteEditDialog,
        props: { route },
        scrollable: false,
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