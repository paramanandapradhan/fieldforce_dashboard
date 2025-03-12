import { DialogSizeEnum, getDialogSize, isMobileScreen, openDeleteConfirmDialog, openDialog, openLoadingDialog, openPickerDialog, showErrorToast, showSuccessToast, showToast } from "@cloudparker/moldex.js";
import type { UserDataModel, } from "./user-types";
import { deleteUser, getAllUsers, syncUsers, UserSubtypeEnum, UserTypeEnum } from "./user-service";
import UserEditDialog from "./components/user-edit-dialog.svelte";
import { ADMIN_USER_ID } from "$lib/core/services/app-service";
import { customerPickerListItemSnippet, userPickerListItemSnippet } from "./components/user-snippets.svelte";


export async function openUserEditDialog(user?: UserDataModel) {
    let res = openDialog({
        bodyComponent: UserEditDialog,
        props: { user },
        hasTitle: true,
        hasHeader: true,
        title: 'Create User',
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        size: DialogSizeEnum.FULL,
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


export async function openUserPickerDialog({ userType, userSubType, multiple, value, maxlength, }:
    { userType: UserTypeEnum, userSubType?: UserSubtypeEnum, multiple?: boolean, value?: string, maxlength?: number }) {
    let items = await getAllUsers({ type: userType, subtype: userSubType }) as UserDataModel[];
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
        hasArrow: true,
        title: userType == UserTypeEnum.USER_TYPE_CUSTOMER ? `Select Customer` : `Select User`,
        itemTileSnippet: userType == UserTypeEnum.USER_TYPE_CUSTOMER ? customerPickerListItemSnippet : userPickerListItemSnippet,
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
