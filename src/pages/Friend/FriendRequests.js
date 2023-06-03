import React, { useEffect, useState } from 'react';
import{getAuth} from 'firebase/auth';
import { auth, db } from '../../utils/firebase';
import { getDatabase, ref, onValue, remove, set,get,child } from 'firebase/database';

function FriendRequests() {
  const [friendRequests, setFriendRequests] = useState([]);
  const auth = getAuth();
  const db = getDatabase();
  useEffect(() => {
    const friendRequestsRef = ref(db, `Users/${auth.currentUser.uid}/friendRequests`);
    const unsub = onValue(friendRequestsRef, async (snapshot) => {
      const friendRequestsData = snapshot.val();
      if (friendRequestsData) {
        const friendRequestsList = [];
        for (let id in friendRequestsData) {
          const senderID = friendRequestsData[id];
          // Fetch the name of the sender
          const snapshot = await get(ref(db, `Users/${senderID}/name`));
          const senderName = snapshot.val();
          friendRequestsList.push({
            id,
            senderID,
            senderName
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
  

  const handleAcceptRequest = (requestId, senderID) => {
    const currentUserID = auth.currentUser.uid;
    const currentUserFriendsRef = ref(db, `Users/${currentUserID}/friends`);
    const senderFriendsRef = ref(db, `Users/${senderID}/friends`);
  
    set(child(currentUserFriendsRef, senderID), true);
    set(child(senderFriendsRef, currentUserID), true);
  
    const friendRequestsRef = ref(db, `Users/${currentUserID}/friendRequests`);
    remove(child(friendRequestsRef, requestId));
  };
  

  const handleDeclineRequest = async (requestId) => {
    const currentUserID = auth.currentUser.uid;
    const friendRequestsRef = ref(db, `Users/${currentUserID}/friendRequests`);
    await remove(friendRequestsRef.child(requestId));
  };

  return (
    <div>
    <h1>Friend Requests</h1>
    {friendRequests.map((request) => (
      <div key={request.id}>
          <p>{request.senderName} wants to be your friend.</p>      
        <button onClick={() => handleAcceptRequest(request.id, request.senderID)}>Accept</button>
        <button onClick={() => handleDeclineRequest(request.id)}>Decline</button>
      </div>
    ))}
  </div>
  );
}

export default FriendRequests;
