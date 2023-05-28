import React, { useState, useEffect } from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import { getDatabase, ref, onValue } from "firebase/database";
import { db, auth } from '../../utils/firebase';


function FriendRequests() {
  const [user, loading] = useAuthState(auth); // useAuthState should return user
  const [friendRequests, setFriendRequests] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    if(user) {
      const friendRequestsRef = ref(db, `friendRequests/${user.uid}`);
      const unsubscribe = onValue(friendRequestsRef, (snapshot) => {
        const data = snapshot.val();
        const friendRequests = [];
        for (let id in data) {
          friendRequests.push({
            requestId: id,
            ...data[id],
          });
        }
        setFriendRequests(friendRequests);
      });

      // remember to unsubscribe from the database when the component unmounts
      return () => unsubscribe();
    }
  }, [user, db]);

  return (
    <div>
      <h1>Friend Requests</h1>
      {friendRequests.map((request) => (
        <div key={request.requestId}>
          <p>{request.from.email} wants to be your friend.</p>
          <button>Accept</button>
          <button>Decline</button>
        </div>
      ))}
    </div>
  );
}

export default FriendRequests;
