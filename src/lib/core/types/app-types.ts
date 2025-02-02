

export type BaseDataModel = {
    _id?: string,

    /**
     * Created at date
     */
    cat?: any;

    /**
     * Updated at date
     */
    uat?: any;

    /**
     * Created By user Id
     */
    cby?: any;

    /**
     * Updated By user id
     */
    uby?: any;

    /**
     * Is the doc deleted
     */
    isDel?: boolean;

    /**
     * 
     * Organization Id
     */
    oid?: any;

    /**
     * Time to live, when the document will be deleted.
     * On the Date this object will be deleted automatically from the database.
     */
    ttl?: any | Date;

    /**
     * Updated at field in date format
     */
    _uatdt?: Date;

    /**
     * Unique org id + record id
     */
    _onid?: string;
}


export type SyncListenerFunction = () => Promise<void>;
