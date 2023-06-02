import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../../utils/firebase';
import { ref, onValue } from 'firebase/database';

function CurrentFriends() {
  const [user, loading] = useAuthState(auth);
  const [currentFriends, setCurrentFriends] = useState([]);

  useEffect(() => {
    if(user) {
      const friendsRef = ref(db, 'Friends');
      onValue(friendsRef, (snapshot) => {
        const friends = [];
        snapshot.forEach((childSnapshot) => {
          const friend = childSnapshot.val();
          if (friend.user1 === auth.currentUser.uid || friend.user2 === auth.currentUser.uid) {
            friends.push(friend);
          }
        });
        setCurrentFriends(friends);
      });
    }
  }, [user]);

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
