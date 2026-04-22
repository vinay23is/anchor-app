import {
  collection, addDoc, query, orderBy,
  onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

export function subscribeToChat(chatId, callback) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function sendMessage(chatId, uid, username, text) {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    uid,
    username,
    text,
    createdAt: serverTimestamp(),
  });
}
