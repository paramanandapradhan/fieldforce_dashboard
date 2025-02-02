import { isMobileScreen, openDeleteConfirmDialog, openDialog, openLoadingDialog, openPickerDialog, showErrorToast, showSuccessToast, showToast } from "@cloudparker/moldex.js";
import type { UserDataModel, UserTypeEnum } from "./user-types";
import { deleteUser, getAllUsers, syncUsers } from "./user-service";
import UserEditDialog from "./components/user-edit-dialog.svelte";
import { ADMIN_USER_ID } from "$lib/core/services/app-service";


export async function openUserEditDialog(user?: UserDataModel) {
    let res = openDialog({
        bodyComponent: UserEditDialog,
        props: { user },
        hasTitle: true,
        hasHeader: true,
        title: 'Create user',
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        size: isMobileScreen() ? 'full' : 'sm',
        hasFooter: true,
        hasFooterCloseButton: true,
        hasFooterOkButton: true,
        footerOkButtonLable: 'Save',
        targetFormId: 'user-edit-form'
    });
    return res;
}

export async function openUserDeleteDialog(user: UserDataModel) {
    if (user._id == ADMIN_USER_ID) {
        showToast({ msg: 'Can not delete the main Admin Staff!' });
        return;
    }
    if (user && user._id && (await openDeleteConfirmDialog({}))) {
        let loading = await openLoadingDialog({});
        try {
            await deleteUser(user._id!);
            await syncUsers();
            showSuccessToast();
        } catch (error) {
            console.error('Error on delete user.');
            console.error(error);
            showErrorToast();
        }
        loading.closeDialog();
        return user;
    }
}

export async function openUserPhotoDialog(user: UserDataModel) {
    // await openComponentDialog({ component: UserPhotoDialog, props: { user } })
}



export async function openPartyEditDialog(guest?: UserDataModel) {
    // let data: string = await openComponentDialog({
    //     component: UserPartyEditFormDialog,
    //     props: { user: guest, title: guest?._id ? 'Update Party' : 'Create Party' },
    //     scrollable: true,
    //     cancelable: false,
    //     isFullScreen: true,
    // })
    // return data;
}


export async function openUserPickerDialog({ userType, multiple, value, maxlength }: { userType: UserTypeEnum, multiple?: boolean, value?: string, maxlength?: number }) {
    let items = await getAllUsers({ type: userType })
    let res = await openPickerDialog({
        items,
        value,
        multiple,
        maxlength,
        hasHeader: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        hasTitle: true,
        hasFooter: multiple,
        hasFooterCloseButton: multiple,
        hasFooterOkButton: multiple,
        footerOkButtonLable: 'Select',
        title: `Pick`
    });
    return res;
}

export async function openPartyPickerDialog(value?: string[] | string): Promise<string | string[]> {
    // let res: string | string[] = await openComponentDialog({
    //     component: UserPickerDialog,
    //     props: { title: 'Select Party', value, userType: UserTypeEnum.USER_PARTY, autoSelect: true },
    //     scrollable: true,
    //     isFullScreen: isMobileScreen(),
    // })
    // return res;
    return '';
}
