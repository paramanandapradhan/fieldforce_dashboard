import type { Feature, FeatureMap } from "./role-types";

 
export const FEATURES_MAP: FeatureMap = {
    '1': { name: 'Staff', desc: "All functionality about a user" },
    '2': { name: 'Party', desc: "Business party management (Suplier, Customer ...)" },
    '3': { name: 'Cashbook', desc: "Finance realed services, Cashbook, Payment, Due, Collection" },
    '4': { name: 'Attribute', desc: "Application Attribute Management" },
    '5': { name: 'Documents', desc: "Organizationa Documents" },
    '6': { name: 'Accounts', desc: "finacial account management" },
    '7': { name: 'Entry', desc: "Cashbook entry management" },
}

export const FEATURES_LIST: Feature[] = Object.keys(FEATURES_MAP).map((id: string) => {
    let value: Feature = FEATURES_MAP[id];
    value._id = id;
    return value;
})

