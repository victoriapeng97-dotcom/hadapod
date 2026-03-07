import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-1ZTP0xT1FwxAItX19MnXcNcM4LOfZDk",
  authDomain: "hadapod-c4ffe.firebaseapp.com",
  projectId: "hadapod-c4ffe",
  storageBucket: "hadapod-c4ffe.firebasestorage.app",
  messagingSenderId: "710108298503",
  appId: "1:710108298503:web:5bb69d81656175c84ad9a2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);
export const saveUserData = async (userId, data) => {
  await setDoc(doc(db, "users", userId), data, { merge: true });
};
export const getUserData = async (userId) => {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data() : null;
};