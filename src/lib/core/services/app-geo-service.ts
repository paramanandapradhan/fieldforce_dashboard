const KEY_GEO_INFO = 'geo.info';


export type GeoInfoType = {
    /**
     * Logitude of the requested machine address.
     */
    longitude?: string,
    /**
    * Latitude of the requested machine address.
    */
    latitude?: string,

    /**
    * Continent of the requested machine address.
    */
    continent?: string,

    /**
    * Country of the requested machine address.
    */
    country?: string,

    /**
    * TimeZone of the requested machine address.
    */
    timezone?: string,

    /**
     * City name of the requested machine address.
     */
    city?: string,

    /**
    * Region name of the requested machine address.
    */
    region?: string,

    /**
    * Region Code of the requested machine address.
    */
    regionCode?: string,

    /**
    * Organization of the requested machine address.
    */
    asOrganization?: string,

    /**
    * Postal Code of the requested machine address.
    */
    postalCode?: string
}

let geoInfo: GeoInfoType;

export async function getGeoInfo() {
    if (!geoInfo) {
        if (localStorage) {
            let str = localStorage.getItem(KEY_GEO_INFO);
            if (str) {
                geoInfo = JSON.parse(str);
            } else {
                let res = await fetch('https://geoinfo.crawlink.com/');
                if (res) {
                    let data = await res.json();
                    geoInfo = data;
                    localStorage.setItem(KEY_GEO_INFO, JSON.stringify(data));
                }
            }
        }
    }
    return geoInfo;
}

export function initGeoService() {
    getGeoInfo();
}




