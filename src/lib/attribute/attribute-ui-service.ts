import { isMobileScreen, openDeleteConfirmDialog, openDialog, openPickerDialog, sort } from "@cloudparker/moldex.js";
import type { AttributeDataModel } from "./attribute-types";
import AttributeEditDialog from "./components/attribute-edit-dialog.svelte";
import { attributeTypeConfigs, AttributeTypeEnum, deleteAttribute, getAllAttributes, getAttributeTypeConfig, syncAttributes, } from "./attribute-service";
import AttributeDetailsDialog from "./components/attribute-details-dialog.svelte";


export async function openAttributeEditDialog({ attribute, attributeType, parent }: { attributeType: AttributeTypeEnum, attribute?: AttributeDataModel, parent?: string }) {
    let attributeTypeConfig = getAttributeTypeConfig(attributeType);
    if (attributeTypeConfig) {
        let nameLabel = `${attributeTypeConfig.label} name`;
        let title = `${attribute?._id ? 'Edit' : 'Create'} ${attributeTypeConfig.label}`;

        let res = await openDialog({
            bodyComponent: AttributeEditDialog,
            props: {
                parent,
                attribute,
                attributeType,
                nameLabel,
            },
            hasHeader: true,
            hasFooter: true,
            hasHeaderBack: isMobileScreen(),
            hasHeaderClose: !isMobileScreen(),
            hasFooterCloseButton: true,
            hasFooterOkButton: true,
            hasTitle: true,
            title: title,
            targetFormId: 'attribute-edit-form'
        });

        console.log(res);
        return res;
    }

}

export async function openAttributeDeleteDialog(attribute: AttributeDataModel) {
    if (attribute?._id && await openDeleteConfirmDialog()) {
        await deleteAttribute(attribute._id);
        await syncAttributes();
        return attribute;
    }
}

export async function openAttributeTypePickerDialog() {
    let items = sort({ array: attributeTypeConfigs, field: 'label' });
    let res = await openPickerDialog<AttributeTypeEnum>({
        items,
        title: 'Pick Attribute Type',
        titleFieldName: 'label',
        searchFieldName: 'label',
        hasArrow: true,
    });

    return res;
}

export async function openAttributeDetailsDialog(attributeId: string) {
    let res = await openDialog({
        bodyComponent: AttributeDetailsDialog,
        props: {
            attributeId
        },
        hasHeader: true,
        hasHeaderBack: isMobileScreen(),
        hasHeaderClose: !isMobileScreen(),
        hasTitle: true,
        title: 'Attribute',
    });

    return res;
}


export async function openAttributePickerDialog({ attributeType, multiple, value, maxlength }: { attributeType: AttributeTypeEnum, multiple?: boolean, value?: string, maxlength?: number }) {
    let attributeTypeConfig = getAttributeTypeConfig(attributeType);
    if (attributeTypeConfig) {
        let items = await getAllAttributes({ type: attributeType })
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
            title: `Pick ${attributeTypeConfig.label}`
        });
        return res;
    }
}