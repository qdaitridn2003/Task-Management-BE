import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

import { FirebaseConfig } from '../configs';
import { HashHandler, uploadPathHelper } from '../utilities';

initializeApp(FirebaseConfig);

const firebaseStorage = getStorage();

const firebaseParty = {
    uploadImage: async (file: Express.Multer.File, type: number): Promise<string> => {
        const hashImage = await HashHandler.init(file.originalname);
        const storagePath = uploadPathHelper(type);
        const storageRef = ref(firebaseStorage, `${storagePath}/${hashImage}`);
        const metadata = { contentType: file.mimetype };
        const snapShot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const imageUrl = await getDownloadURL(snapShot.ref);
        return imageUrl;
    },
};

export default firebaseParty;
