
import * as admin from 'firebase-admin';


export async function updateObjectMaxAge({ bucket, filePath, days = 15 }: { bucket: string, filePath: string, days?: number }) {
    const newMetadata = {
        // 15 days
        cacheControl: 'public,max-age=' + 60 * 60 * 24 * days, // sec * min * hr * day
    };

    const bucketRef = admin.storage().bucket(bucket);
    await bucketRef.file(filePath).setMetadata(newMetadata);
    console.log('updateObjectMaxAge', filePath, days);
};

export async function getDownloadUrl({ bucket, filePath }: { bucket: string, filePath: string }) {
    try {
        const ref = admin.storage().bucket(bucket).file(filePath);
        const [metadata] = await ref.getMetadata();
        const token = metadata.metadata!.firebaseStorageDownloadTokens;
        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;
        return downloadUrl;
    } catch (error) {
        console.error(error);
    }
    return null;
}


export async function removeObject({ bucket, path }: { bucket: string, path: string }) {
    // possible path values
    // https://firebasestorage.googleapis.com/v0/b/dev-cp-stackbook.appspot.com/o/avatars%2FpWT9qPnkVJX4LYKa0m8ZyQ0Vgy12%2Fparamananda_pradhan1-yJFAD4x.webp?alt=media&token=4c7a626d-dcc7-4ed4-b806-75a1e286fd10
    // https://www.googleapis.com/download/storage/v1/b/dev-cp-stackbook.appspot.com/o/avatars%2FpWT9qPnkVJX4LYKa0m8ZyQ0Vgy12%2Fparamananda_pradhan1-t4mmz.webp?generation=1661613039958741&alt=media
    // /avatars/pWT9qPnkVJX4LYKa0m8ZyQ0Vgy12/paramananda_pradhan1-t4mmz.webp?alt=media
    console.log('removeObject : ', bucket, path);
    try {
        if (path) {

            let filePath = path.split('?')[0];
            if (filePath) {
                let segments = filePath.split(`/b/${bucket}/o/`);
                if (segments.length == 2) {
                    filePath = decodeURIComponent(segments[1])
                } else {
                    filePath = segments[0];
                }
            }

            filePath = filePath.split('/').filter(o => o).join('/');

            console.log('Deleting file : ', filePath);

            if (filePath) {
                const bucketRef = admin.storage().bucket(bucket);
                await bucketRef.file(filePath).delete();
                console.log('Deleted file : ', filePath);
            }
        }
    } catch (error) {
        console.error(error);
    }
};


