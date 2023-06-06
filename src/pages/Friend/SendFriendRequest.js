import React, { useState } from "react";
import { getAuth } from "@firebase/auth";
import { db, auth } from "../../utils/firebase";
import { getDatabase, ref, get, child, set, push } from "firebase/database";

function SendFriendRequest() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  //const auth = getAuth();
  //const db = getDatabase();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userRef = ref(db, "Users");
    let recipientID = null;
    const snapshot = await get(userRef);

    snapshot.forEach((data) => {
      if (data.val().email === email) {
        recipientID = data.key;
      }
    });
    if (recipientID) {
      const friendRequestsRef = ref(db, `Users/${recipientID}/friendRequests`);
      const friendRequestsSnapshot = await get(friendRequestsRef);
      const senderID = auth.currentUser.uid;
      let friendRequestExists = false;
      friendRequestsSnapshot.forEach((request) => {
        if (request.val() === senderID) {
          friendRequestExists = true;
          return true; // Exit loop if friend request already exists
        }
      });
      if (!friendRequestExists) {
        const newFriendRequestRef = push(friendRequestsRef);
        await set(newFriendRequestRef, senderID);
        setEmail("");
      } else {
        console.log("Friend request already sent to this user.");
      }
    } else {
      console.log("No user with the provided email found.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow-lg p-6">
      <h2 className="text-xl font-bold text-blue-500 mb-4">
        Send Friend Request
      </h2>
      <div className="flex items-center mb-4">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Friend's Email"
          required
          className="border-gray-300 rounded px-3 py-2 flex-grow mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-3 py-2"
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default SendFriendRequest;
