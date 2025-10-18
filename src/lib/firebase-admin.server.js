// Firebase Admin SDK 초기화 (서버 전용)
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,

  } = process.env;

  // 🔹 privateKey 설정 (둘 중 하나)
  let privateKey = FIREBASE_PRIVATE_KEY;


  // 🔹 \n 이스케이프된 경우 줄바꿈 복원
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  // 🔹 환경변수 유효성 검사
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !privateKey) {
    console.error('❌ Firebase Admin SDK 환경변수가 올바르지 않습니다.');
    throw new Error('Firebase Admin SDK 환경변수가 설정되지 않았습니다.');
  }

  // 🔹 Firebase Admin SDK 초기화
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });

  console.log('✅ Firebase Admin SDK 초기화 완료');
  console.log('PROJECT_ID:', FIREBASE_PROJECT_ID);
}

// 🔹 Firestore & Auth 인스턴스 내보내기
export const db = admin.firestore();
export const auth = admin.auth();
export { admin };
