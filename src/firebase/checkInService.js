import {
  collection, addDoc, query, where,
  orderBy, limit, getDocs, serverTimestamp,
  doc, updateDoc, getDoc,
} from "firebase/firestore";
import { db } from "./config";

export async function saveCheckIn(uid, username, message, mood) {
  await addDoc(collection(db, "checkins"), {
    uid,
    username,
    message,
    mood,
    createdAt: serverTimestamp(),
  });

  await updateStreak(uid);
}

async function updateStreak(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const lastCheckIn = data.lastCheckIn?.toDate?.();
  let streak = data.streak || 0;

  if (lastCheckIn) {
    const last = new Date(lastCheckIn);
    last.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (last.getTime() === today.getTime()) {
      // already checked in today, don't change streak
    } else if (last.getTime() === yesterday.getTime()) {
      streak += 1;
    } else {
      streak = 1;
    }
  } else {
    streak = 1;
  }

  await updateDoc(ref, { streak, lastCheckIn: serverTimestamp() });
}

export async function getRecentMoods(uid) {
  const q = query(
    collection(db, "checkins"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(3)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().mood);
}

export async function getMoodHistory(uid) {
  const snap = await getDocs(
    query(collection(db, "checkins"), where("uid", "==", uid), limit(30))
  );
  return snap.docs
    .map((d) => ({
      mood: d.data().mood,
      createdAt: d.data().createdAt?.toDate?.() || new Date(),
    }))
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(-7);
}
