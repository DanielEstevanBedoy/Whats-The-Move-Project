import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  get,
  child,
  update,
} from "firebase/database";

function FriendRequests() {
  const [friendRequests, setFriendRequests] = useState([]);
  const auth = getAuth();
  const db = getDatabase();
  useEffect(() => {
    const friendRequestsRef = ref(
      db,
      `Users/${auth.currentUser.uid}/friendRequests`
    );
    const unsub = onValue(friendRequestsRef, async (snapshot) => {
      const friendRequestsData = snapshot.val();
      if (friendRequestsData) {
        const friendRequestsList = [];
        for (let id in friendRequestsData) {
          const senderID = friendRequestsData[id];
          // Fetch the name of the sender
          const snapshot = await get(ref(db, `Users/${senderID}/displayName`));
          const senderName = snapshot.val();
          friendRequestsList.push({
            id,
            senderID,
            senderName,
          });
        }
        setFriendRequests(friendRequestsList);
      } else {
        setFriendRequests([]);
      }
    });

    return () => {
      unsub();
    };
  }, [auth, db]);

  // const handleAcceptRequest = (requestId, senderID) => {
  //   const currentUserID = auth.currentUser.uid;
  //   const currentUserFriendsRef = ref(db, `Users/${currentUserID}/friends`);
  //   const senderFriendsRef = ref(db, `Users/${senderID}/friends`);

  //   set(child(currentUserFriendsRef, senderID), true);
  //   set(child(senderFriendsRef, currentUserID), true);

  //   const friendRequestsRef = ref(db, `Users/${currentUserID}/friendRequests`);
  //   remove(child(friendRequestsRef, requestId));
  // };

  const handleAcceptRequest = (requestId, senderID) => {
    const currentUserID = auth.currentUser.uid;

    const updates = {};
    updates[`Users/${currentUserID}/friends/${senderID}`] = true;
    updates[`Users/${senderID}/friends/${currentUserID}`] = true;
    updates[`Users/${currentUserID}/friendRequests/${requestId}`] = null;

    update(ref(db), updates);
  };

  const handleDeclineRequest = async (requestId) => {
    const currentUserID = auth.currentUser.uid;
    const friendRequestsRef = ref(db, `Users/${currentUserID}/friendRequests`);
    await remove(child(friendRequestsRef, requestId));
  };

  return (
    <div className="bg-white rounded shadow-lg p-6 mt-6">
      <h1 className="text-xl font-bold text-blue-500 mb-4">Friend Requests</h1>
      {friendRequests.map((request) => (
        <div key={request.id} className="bg-gray-100 rounded p-4 mb-4">
          <p className="text-gray-700 text-sm">
            {request.senderName} wants to be your friend.
          </p>
          <div className="mt-2">
            <button
              onClick={() => handleAcceptRequest(request.id, request.senderID)}
              className="bg-blue-500 text-white rounded px-3 py-1 mr-2"
            >
              Accept
            </button>
            <button
              onClick={() => handleDeclineRequest(request.id)}
              className="bg-red-500 text-white rounded px-3 py-1"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FriendRequests;
