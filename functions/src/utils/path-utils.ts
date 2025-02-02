
export const getAppPath = () => {
    return `/apps/${process.env.VITE_APP_ID}`;
}

export const getBooksCollectionPath = () => {
    return `${getAppPath()}/books`;
}


export const getUsersIdentitiesCollectionPath = () => {
    return `${getAppPath()}/users-identities`;
}

export const getUsersIdentitiesDocPath = ({ uid }: { uid: string, }) => {
    return `${getUsersIdentitiesCollectionPath()}/${uid}`;
}

export const getBooksDocPath = ({ bookId }: { bookId: string }) => {
    return `${getAppPath()}/books/${bookId}`;
}

export const getBooksAccessesCollectionPath = () => {
    return `${getAppPath()}/books-accesses`;
}

export const getBooksAccessesDocPath = ({ bookId }: { bookId: string }) => {
    return `${getBooksAccessesCollectionPath()}/${bookId}`;
}

export const getUsersAccessesCollectionPath = () => {
    return `${getAppPath()}/users-accesses`;
}

export const getUsersAccessesDocPath = ({ uid }: { uid: string, }) => {
    return `${getUsersAccessesCollectionPath()}/${uid}`;
}
