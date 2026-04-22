import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./config";

export async function getFeed(currentUid) {
  const q = query(
    collection(db, "checkins"),
    orderBy("createdAt", "desc"),
    limit(20)
  );

  const snap = await getDocs(q);
  const all = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((post) => post.uid !== currentUid);

  return all.slice(0, 4);
}
