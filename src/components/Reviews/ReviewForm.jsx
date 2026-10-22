// it allows logged in user to submit feedback for another user (rating or comment)
// it is stored in separate firestore collection becayse one user can receive many reviews
// review->react state->addDoc()->firestore->review saved
// function ReviewForm({toUserId})=> reviewform needs to know who is being reviewed
// The review is added using addDoc(), allowing Firestore to automatically generate a unique document ID.
// Before adding a new review, we check whether the logged-in user has already reviewed the same person.
// This prevents duplicate reviews by querying Firestore for an existing review with the same user

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {useAuth} from "@/context/AuthContext";
import {db} from "@/firebase/firebase";
import {addDoc,collection,serverTimestamp,query,where,getDocs,} from "firebase/firestore";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/firebaseErrors";

function ReviewForm({toUserId}) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const {currentUser}=useAuth();

  const handleSubmit=async()=>{
    if(!rating||!comment){
        toast.warn("Please select a rating and write a comment.");
        return;
    }
    try{
        const reviewQuery=query(
            collection(db,"reviews"),
            where("fromUser","==",currentUser.uid),
            where("toUser","==",toUserId)
        );
        const existingReview=await getDocs(reviewQuery);
        if(!existingReview.empty){
            toast.info("You have already reviewed this user.");
            return;
        }
        await addDoc(
            collection(db,"reviews"),
            {
                fromUser:currentUser.uid,
                toUser:toUserId,
                rating:Number(rating),
                comment,
                createdAt:serverTimestamp(),
            }
        );
        toast.success("Review submitted!");
        setRating("");
        setComment("");
    }catch(error){
        console.error(error);
        toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h2 className="text-3xl font-bold text-white">
        Leave a Review
      </h2>

      <p className="mt-2 text-slate-300">
        Share your experience after completing a skill swap.
      </p>

      {/* Rating */}

      <div className="mt-8">

        <label className="mb-2 block text-slate-200">
          Rating
        </label>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none">
          <option value="">Select Rating</option>
          <option value="5">★★★★★ (5)</option>
          <option value="4">★★★★☆ (4)</option>
          <option value="3">★★★☆☆ (3)</option>
          <option value="2">★★☆☆☆ (2)</option>
          <option value="1">★☆☆☆☆ (1)</option>
        </select>

      </div>

      {/* Comment */}

      <div className="mt-6">

        <label className="mb-2 block text-slate-200">
          Comment
        </label>

        <textarea
          rows="5"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your experience..."
          className="w-full rounded-xl border border-white/10 bg-white/10 p-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-500"/>

      </div>

      <Button
        onClick={handleSubmit}
        className="mt-8 h-12 w-full bg-blue-500 hover:bg-blue-600">
        Submit Review
      </Button>

    </div>
  );
}

export default ReviewForm;