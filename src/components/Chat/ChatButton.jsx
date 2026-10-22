// this will navigate the user to the chat page
// ChatButton opens an existing conversation or creates one before navigating to the chat page.

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/firebase";
import {addDoc,collection,getDocs,query,serverTimestamp,where,} from "firebase/firestore";

function ChatButton({ toUserId }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const openChat = async () => {
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", currentUser.uid)
    );
    const snapshot = await getDocs(q);
    // Is there already a conversation between these two users?
    const alreadyExists = snapshot.docs.some((doc) =>
      doc.data().participants.includes(toUserId)
    );

    if (!alreadyExists) {
      await addDoc(
        collection(db, "conversations"),
        {
          participants: [
            currentUser.uid,
            toUserId,
          ],
          createdAt: serverTimestamp(),
          lastMessage: "",
          updatedAt: serverTimestamp(),
        }
      );
    }
    navigate(`/chat/${toUserId}`);
  };
  return (
    <Button
      onClick={openChat}
      className="mt-4 h-12 w-full rounded-xl bg-white/10 text-white hover:bg-white/20">
      Chat
    </Button>
  );
}

export default ChatButton;