import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApsRga92UJTgchi6riLFwAXruGqMJYUw8",
  authDomain: "hr-nexus-c1c0c.firebaseapp.com",
  projectId: "hr-nexus-c1c0c",
  storageBucket: "hr-nexus-c1c0c.firebasestorage.app",
  messagingSenderId: "1047234276295",
  appId: "1:1047234276295:web:9cada164bb2da132b107e2",
  measurementId: "G-6FNSQYMSD5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;