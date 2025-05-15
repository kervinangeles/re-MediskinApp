import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDK7irjDHpCBPZa2Nw0C9qXR8LeLzPQT00",
  authDomain: "mediskin-eddbd.firebaseapp.com",
  projectId: "mediskin-eddbd",
  storageBucket: "mediskin-eddbd.appspot.com",
  messagingSenderId: "644648583952",
  appId: "1:644648583952:web:4d5fe18679ca4d6afb5b95",
};

const app = initializeApp(firebaseConfig);

const FIREBASE_AUTH = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, FIREBASE_AUTH, db, storage };