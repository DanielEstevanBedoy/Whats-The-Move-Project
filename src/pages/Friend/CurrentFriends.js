import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, off } from 'firebase/database';

function CurrentFriends() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const friendsRef = ref(getDatabase(), `Users/${currentUser.uid}/friends`);
      const listener = onValue(friendsRef, (snapshot) => {
        const friendsData = snapshot.val();
        if (friendsData) {
          const friendIds = Object.keys(friendsData).filter(key => friendsData[key]);  // Only keep truthy friendIDs
          const promises = friendIds.map(friendId => {
            return new Promise((resolve) => {
              const friendRef = ref(getDatabase(), `Users/${friendId}`);
              onValue(friendRef, friendSnap => {
                const friendUserData = friendSnap.val();
                resolve(friendUserData.displayName);  // Assuming there's a displayName property
              });
            });
          });
          Promise.all(promises)
            .then(friendNames => {
              setFriends(friendNames);
            });
        } else {
          setFriends([]);
        }
      });
      return () => off(friendsRef, listener);
    } else {
      setFriends([]);
    }
  }, []);

  return (
    <div>
      <h1>Current Friends</h1>
      {friends.length > 0 ? (
        <p>You are friends with: {friends.join(', ')}</p>
      ) : (
        <p>You have no friends.</p>
      )}
    </div>
  );
}

export default CurrentFriends;

