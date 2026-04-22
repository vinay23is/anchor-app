import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKJUQo9_xlKTUAAfdW1biFlg-finmYEcA",
  authDomain: "anchor-app-e8ffd.firebaseapp.com",
  projectId: "anchor-app-e8ffd",
  storageBucket: "anchor-app-e8ffd.firebasestorage.app",
  messagingSenderId: "849263473136",
  appId: "1:849263473136:web:6ab8974d3e97acc4c02d35",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
