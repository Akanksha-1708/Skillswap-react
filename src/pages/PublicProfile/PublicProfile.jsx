// PublicProfile displays the complete information of a selected user.
// The page uses a dynamic route (/profile/:userId), where userId is the
// Firestore document ID.
//
// Flow:
//
// BrowseSkills
//       ↓
// Click "View Profile"
//       ↓
// React Router (useParams)
//       ↓
// Extract userId from URL
//       ↓
// Fetch ONE document using getDoc()
//       ↓
// Store user in React state
//       ↓
// Display the user's profile
//
// Unlike BrowseSkills, which fetches every user using getDocs(),
// this page fetches only one specific user using getDoc().
// useparams() extracts the userId from the URL, which is then used to fetch the user's data from Firestore.
// a user can leave a review only after an accepted skill swap
import { useAuth } from "@/context/AuthContext";
import ReviewCard from "@/components/Reviews/ReviewCard";
import { useEffect, useState } from "react";
import ChatButton from "@/components/Chat/ChatButton";
import { db } from "@/firebase/firebase";
import { useParams } from "react-router-dom";
import RequestButton from "@/components/SwapRequest/RequestButton";
import ReviewForm from "@/components/Reviews/ReviewForm";
import {doc,getDoc,collection,getDocs,query,where} from "firebase/firestore";
function PublicProfile() {

    const { currentUser } = useAuth();
    const currentUid = currentUser?.uid;
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);

    const averageRating=reviews.length>0?
    (reviews.reduce((sum,review)=>sum+review.rating,0)/reviews.length).toFixed(1)
    :"No Ratings";
    useEffect(() => {
        const fetchUser=async()=>{
            const docRef=doc(db,"users",userId);
            const docSnap=await getDoc(docRef);
            if(docSnap.exists()){
                setUser(docSnap.data());
            }
        const reviewQuery=query(
          collection(db,"reviews"),
          where("toUser","==",userId)
        );

        const requestQuery = query(
        collection(db, "swapRequests"),
        where("fromUser", "==", currentUid),
        where("toUser", "==", userId),
        where("status", "==", "accepted")
        );

        const requestSnapshot = await getDocs(requestQuery);
        setCanReview(!requestSnapshot.empty);

        const reviewSnapshot=await getDocs(reviewQuery);
        const reviewList=reviewSnapshot.docs.map(doc=>({
          id:doc.id,
          ...doc.data(),
        }));
        setReviews(reviewList);            
        };
        fetchUser();
    }, [userId, currentUid]);

    if (!user) {
    return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793]">
      <h1 className="text-3xl text-white">
        Loading...
      </h1>
    </div>
    );
    }

return (
  <div className="min-h-screen bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793] px-6 py-10">

    <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

      <h1 className="text-5xl font-bold text-white">
        {user.fullName}
      </h1>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xl text-yellow-400">⭐</span>
        <span className="text-lg font-semibold text-white">{averageRating}</span>
        <span className="text-slate-300">
          ({reviews.length} Reviews)
        </span>
      </div>

      <p className="mt-4 text-lg text-slate-300">
        {user.bio}
      </p>

      <div className="mt-8">

        <h2 className="text-xl font-semibold text-blue-400">
          Teaching Skills
        </h2>

        <p className="mt-2 text-white">
          {user.teachingSkills.join(", ")}
        </p>

      </div>

      <div className="mt-8">

        <h2 className="text-xl font-semibold text-green-400">
          Learning Skills
        </h2>

        <p className="mt-2 text-white">
          {user.learningSkills.join(", ")}
        </p>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">

        <div>

          <h2 className="font-semibold text-blue-400">
            Experience
          </h2>

          <p className="mt-2 text-white">
            {user.experience}
          </p>

        </div>

        <div>

          <h2 className="font-semibold text-blue-400">
            Availability
          </h2>

          <p className="mt-2 text-white">
            {user.availability}
          </p>

        </div>

      </div>
      
        {currentUser?.uid!==userId&&(
        <>
        <RequestButton receiver={user}/>
        <ChatButton toUserId={userId}/>
        </>
        )}
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          {currentUser?.uid!==userId&&canReview&&(<ReviewForm toUserId={userId}/>)}

        <div className="mt-10 space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Reviews
          </h2>
          {reviews.map(review=>(
            <ReviewCard key={review.id} review={review}/>
          ))}
          {reviews.length===0&&(
            <p className="text-slate-300">No reviews yet.</p>
          )}
        </div>
        </div>
  </div>
);
}

export default PublicProfile;