import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { generateUsername } from "../utils/generateUsername";

export async function getOrCreateUser(firebaseUser) {
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  }

  const newUser = {
    uid: firebaseUser.uid,
    username: generateUsername(firebaseUser.email),
    streak: 0,
    lastCheckIn: null,
    createdAt: serverTimestamp(),
  };

  await setDoc(ref, newUser);
  return newUser;
}
