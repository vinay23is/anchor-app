import {
  collection, addDoc, getDocs, updateDoc,
  doc, query, where, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

export async function sendConnectRequest(fromUid, fromUsername, toUid, toUsername) {
  const existing = await getDocs(
    query(
      collection(db, "connect_requests"),
      where("fromUid", "==", fromUid),
      where("toUid", "==", toUid)
    )
  );
  const alreadySent = existing.docs.some(
    (d) => d.data().status === "pending"
  );
  if (alreadySent) return { alreadySent: true };

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await addDoc(collection(db, "connect_requests"), {
    fromUid,
    fromUsername,
    toUid,
    toUsername,
    status: "pending",
    createdAt: serverTimestamp(),
    expiresAt,
  });

  return { success: true };
}

export async function getIncomingRequests(uid) {
  const snap = await getDocs(
    query(collection(db, "connect_requests"), where("toUid", "==", uid))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((r) => r.status === "pending");
}

export async function getUserChats(uid) {
  const snap = await getDocs(
    query(
      collection(db, "connect_requests"),
      where("status", "==", "accepted")
    )
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((r) => r.fromUid === uid || r.toUid === uid);
}

export async function acceptRequest(requestId, fromUid, fromUsername, toUid, toUsername) {
  const chatRef = await addDoc(collection(db, "chats"), {
    participants: [fromUid, toUid],
    usernames: { [fromUid]: fromUsername, [toUid]: toUsername },
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "connect_requests", requestId), {
    status: "accepted",
    chatId: chatRef.id,
  });

  return chatRef.id;
}

export async function declineRequest(requestId) {
  await updateDoc(doc(db, "connect_requests", requestId), {
    status: "declined",
  });
}
