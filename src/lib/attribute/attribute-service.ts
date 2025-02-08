import { getAuthOrgId } from "$lib/auth/services/auth-service.svelte";
import { DatabaseService } from "$lib/database/database-service";
import { APP_ID } from "$lib/core/services/app-environment-service";
import { IdbWhere } from "@cloudparker/easy-idb";
import type { AttributeTypeConfig, AttributeDataModel } from "./attribute-types";

// Define the enum with all attribute types
export enum AttributeTypeEnum {
    ALL = '0',
    ID_PROOF = '1',
    COUNTRY = '2',
    CITY = '3',
    STATE = '4',
    DISTRICT = '5',
    CUSTOMER_COMPANY = '7',
    CUSTOMER_ROUTE = '9',
    CUSTOMER_TYPE = '10',
    CUSTOMER_SUBTYPE = '11',
    CUSTOMER_CHAIN = '12',
    CUSTOMER_CLASS = '13',
    CUSTOMER_CATEGORY = '14',
    USER_CATEGORY = '16',
    USER_DESIGNATION = '17',
    AREA = '18',
    USER_DEPARTMENT = '19',
}

// Create the configuration array with an item for every enum value.
export const attributeTypeConfigs: AttributeTypeConfig[] = [
    { _id: AttributeTypeEnum.ALL, label: 'All Attributes' },
    { _id: AttributeTypeEnum.ID_PROOF, label: 'ID Proof' },
    { _id: AttributeTypeEnum.COUNTRY, label: 'Country' },
    // Example: If you want to define a relationship (State belongs to Country)
    { _id: AttributeTypeEnum.STATE, label: 'State', parent: AttributeTypeEnum.COUNTRY },
    { _id: AttributeTypeEnum.CITY, label: 'City' },
    { _id: AttributeTypeEnum.DISTRICT, label: 'District' },
    { _id: AttributeTypeEnum.CUSTOMER_COMPANY, label: 'Customer Company' },
    { _id: AttributeTypeEnum.CUSTOMER_ROUTE, label: 'Customer Route' },
    { _id: AttributeTypeEnum.CUSTOMER_TYPE, label: 'Customer Type' },
    { _id: AttributeTypeEnum.CUSTOMER_SUBTYPE, label: 'Customer Subtype' },
    { _id: AttributeTypeEnum.CUSTOMER_CHAIN, label: 'Customer Chain' },
    { _id: AttributeTypeEnum.CUSTOMER_CLASS, label: 'Customer Class' },
    { _id: AttributeTypeEnum.CUSTOMER_CATEGORY, label: 'Customer Category' },
    { _id: AttributeTypeEnum.USER_CATEGORY, label: 'User Category' },
    { _id: AttributeTypeEnum.USER_DESIGNATION, label: 'User Designation' },
    { _id: AttributeTypeEnum.AREA, label: 'Area' },
    { _id: AttributeTypeEnum.USER_DEPARTMENT, label: 'User Department' },
];


class AttributeDatabaseService extends DatabaseService<AttributeDataModel> {

    // Indicates if sync is enabled
    protected syncEnabled: boolean = false;

    // Name of the Firestore collection
    protected collectionName: string = 'attrs';

    // Private constructor to prevent direct instantiation
    constructor() {
        super();
    }

    // Constructs the Firestore collection path for users
    public getFirestoreCollectionPath(): string {
        let path = `/a/${APP_ID}/o/${getAuthOrgId()}/${this.collectionName}`;
        return path;
    }

    public async createAttribute(data: AttributeDataModel, id?: string) {
        return super.createFirestoreDoc(data, id);
    }

    public async updateAttribute(id: string, data: AttributeDataModel) {
        return super.updateFirestoreDoc(id, data);
    }

    public async deleteAttribute(id: string) {
        return super.deleteFirestoreDocSoft(id);
    }

    public async getAttribute(id: string) {
        return super.getOneLocal(id);
    }

    public async getAllAttributes({ type, parent }: { type?: AttributeTypeEnum, parent?: string } = {}) {
        return this.findAttributesLocal({ type, parent });
    }

    public async syncAttributes() {
        return super.sync();
    }

    public async getAttributeCache(id: string) {
        return super.getOneCache(id)
    }

    /**
     * Find data from local database.
     * 
     * @returns {AttributeDataModel} array - all recods from local collection 
     */
    protected async findAttributesLocal({ type, parent }: { type?: AttributeTypeEnum, parent?: string } = {}): Promise<AttributeDataModel[]> {
        let store = await this.getLocalDatabaseStore();
        let oid = getAuthOrgId();
        if (oid) {
            let whereKeys: string[] = ['oid'];
            let whereValue: any[] = [oid];
            if (type) {
                whereKeys.push('type');
                whereValue.push(type)
            }
            if (parent) {
                whereKeys.push('parent');
                whereValue.push(parent);
            }
            let where = IdbWhere(whereKeys, "==", whereValue);
            let array = await store.find<AttributeDataModel>({ where })!;
            return array;
        }
        return [] as AttributeDataModel[];
    }
}


const attributeService = new AttributeDatabaseService();

export async function createAttribute(data: AttributeDataModel, id?: string) {
    return attributeService.createAttribute(data, id);
}

export async function updateAttribute(id: string, data: AttributeDataModel) {
    return attributeService.updateAttribute(id, data);
}

export async function deleteAttribute(id: string) {
    return attributeService.deleteAttribute(id);
}

export async function getAttribute(id: string) {
    return attributeService.getAttribute(id);
}

export async function getAllAttributes({ type, parent }: { type?: AttributeTypeEnum, parent?: string } = {}) {
    return attributeService.getAllAttributes({ type, parent });
}

export async function syncAttributes() {
    return attributeService.syncAttributes();
}

export async function getAttributeCache(id: string) {
    return attributeService.getAttributeCache(id)
}

export function getAttributeTypeConfig(type: AttributeTypeEnum) {
    return attributeTypeConfigs.find((o) => o._id === type);
}
