import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAThYO6I6Hl-oRxtfGVShBoWK_6JT4Rm_k",
  authDomain: "alien-mx.firebaseapp.com",
  projectId: "alien-mx",
  storageBucket: "alien-mx.firebasestorage.app",
  messagingSenderId: "871093076812",
  appId: "1:871093076812:web:f5c279d4a943a8ded2c5e9",
  measurementId: "G-WL69TD5FL4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logoutGoogle = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
