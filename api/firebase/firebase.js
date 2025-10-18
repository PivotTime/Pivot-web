import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// 필요에 따라 다른 서비스(auth, storage 등)도 import 하세요.
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 다른 파일에서 Firestore DB를 사용할 수 있도록 export
export const db = getFirestore(app);

// 필요에 따라 다른 서비스도 export 하세요.
// export const auth = getAuth(app);
// export const storage = getStorage(app);