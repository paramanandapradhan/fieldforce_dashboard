

export const getUsersCollectionPath = (oid: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/cbs`;
}

export const getUsersDocumentPath = (oid: string, uid: string) => {
    return `/a/${process.env.VITE_APP_ID}/o/${oid}/cbs/${uid}`;
}

 