import type { BaseDataModel } from "$lib/app/types/app-types";

export type FileDataModel = BaseDataModel & {
    /**
   * File ID
   */
    _id?: string;

    /**
     * File name
     */
    name?: string;

    /**
     * Organization id
     */
    oid?: string;

    /**
     * File path or storage key
     */
    path?: string;

    /**
     * File Size in bytes
     */
    size?: number;

    /**
     * File type
     */
    type?: string;

    /**
     * Download url, it will be applicable only for user photo
     */
    _durl?: string;

}