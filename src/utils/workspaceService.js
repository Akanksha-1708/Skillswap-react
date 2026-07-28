import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export async function getUserWorkspaces(currentUser) {
  if (!currentUser) return [];

  const q = query(
    collection(db, "learningWorkspaces"),
    where("participants", "array-contains", currentUser.uid)
  );

  const snapshot = await getDocs(q);

  const workspaces = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const workspace = {
        id: docSnap.id,
        ...docSnap.data(),
      };

      const partnerId = workspace.participants.find(
        (uid) => uid !== currentUser.uid
      );

      let partner = null;

      if (partnerId) {
        const userSnap = await getDoc(doc(db, "users", partnerId));

        if (userSnap.exists()) {
          partner = userSnap.data();
        }
      }

      return {
        ...workspace,
        partner,
      };
    })
  );

  return workspaces;
}