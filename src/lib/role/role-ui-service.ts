import { isMobileScreen, openDialog, openPickerDialog } from "@cloudparker/moldex.js";
import type { RoleDataModel } from "./role-types";
import RoleEditDialog from "./components/role-edit-dialog.svelte";
import RolePermissionEditDialog from "./components/role-permission-edit-dialog.svelte";
import RoleUsersListDialog from "./components/role-users-list-dialog.svelte";
import type { UserTypeEnum } from "$lib/user/user-types";
import { getAllUsers } from "$lib/user/user-service";
import { getAllRoles } from "./role-service";

export async function openRoleEditDialog(role?: RoleDataModel) {
    let res = await openDialog({
        bodyComponent: RoleEditDialog,
        props: {
            role
        },
        hasTitle: true,
        title: role?._id ? 'Edit Role' : 'Create Role',
        hasHeader: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        hasFooter: true,
        hasFooterCloseButton: true,
        hasFooterOkButton: true,
        targetFormId: 'role-edit-form'
    });

    return res;
}

export async function openRolePermissionEditDialog(role: RoleDataModel) {
    let res = await openDialog({
        bodyComponent: RolePermissionEditDialog,
        props: {
            role
        },

        hasTitle: true,
        title: 'Edit Permission',
        hasHeader: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        hasFooter: true,
        hasFooterCloseButton: true,
        hasFooterOkButton: true,
        targetFormId: 'role-permission-edit-form'
    });
    return res;
}



export async function openRoleUsersListDialog(role: RoleDataModel) {
    let res = await openDialog({
        bodyComponent: RoleUsersListDialog,
        props: {
            role
        },
        hasTitle: true,
        title: 'Role : ' + role.name,
        hasSubtitle: true,
        subtitle: 'Users',
        hasHeader: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        hasFooter: true,
        hasFooterCloseButton: true,

    });
    return res;
}


export async function openRolePickerDialog({ value, }: { value?: string, }) {
    let items = await getAllRoles()
    let res = await openPickerDialog({
        items,
        value,
        hasHeader: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        hasTitle: true,
        title: `Pick Role`
    });
    return res;
}


