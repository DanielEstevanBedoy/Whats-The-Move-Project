import React, { useState, useEffect } from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import { db, auth } from '../../utils/firebase';
import { getDatabase, ref, onValue } from "firebase/database";

function CurrentFriends() {
  const [user, loading] = useAuthState(auth);
  
  const [currentFriends, setCurrentFriends] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    if (user) {  // check if user exists
      const friendsRef = ref(db, `friends/${user.uid}`);
      const unsubscribe = onValue(friendsRef, (snapshot) => {
        const data = snapshot.val();
        const friends = [];
        for (let id in data) {
          friends.push({
            friendId: id,
            ...data[id],
          });
        }
        setCurrentFriends(friends);
      });

      // remember to unsubscribe from the database when the component unmounts
      return () => unsubscribe();
    }
  }, [user, db]);

  return (
    <div>
      <h2>Current Friends</h2>
      {currentFriends.map((friend) => (
        <div key={friend.friendId}>
          <p>{friend.email}</p>
        </div>
      ))}
    </div>
  );
}

export default CurrentFriends;
