import React, { useEffect, useState } from 'react';
import { auth, db } from '../../utils/firebase';

function FriendRequests() {
  const [user, setUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const friendRequestsRef = db.ref(`Users/${user.uid}/friendRequests`);
        friendRequestsRef.on('value', (snapshot) => {
          const friendRequestsData = snapshot.val();
          if (friendRequestsData) {
            const friendRequestsList = Object.entries(friendRequestsData).map(([id, senderID]) => ({
              id,
              senderID
            }));
            setFriendRequests(friendRequestsList);
          } else {
            setFriendRequests([]);
          }
        });
      } else {
        setUser(null);
        setFriendRequests([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAcceptRequest = (requestId, senderID) => {
    const currentUserID = auth.currentUser.uid;
    const currentUserFriendsRef = db.ref(`Users/${currentUserID}/friends`);
    const senderFriendsRef = db.ref(`Users/${senderID}/friends`);

    currentUserFriendsRef.child(senderID).set(true);
    currentUserFriendsRef.child(requestId).set(true);
    senderFriendsRef.child(currentUserID).set(true);

    const friendRequestsRef = db.ref(`Users/${currentUserID}/friendRequests`);
    friendRequestsRef.child(requestId).remove();
  };

  const handleDeclineRequest = (requestId) => {
    const currentUserID = auth.currentUser.uid;
    const friendRequestsRef = db.ref(`Users/${currentUserID}/friendRequests`);
    friendRequestsRef.child(requestId).remove();
  };

  return (
    <div>
      <h1>Friend Requests</h1>
      {friendRequests.map((request) => (
        <div key={request.id}>
          <p>{request.senderID} wants to be your friend.</p>
          <button onClick={() => handleAcceptRequest(request.id, request.senderID)}>Accept</button>
          <button onClick={() => handleDeclineRequest(request.id)}>Decline</button>
        </div>
      ))}
    </div>
  );
}

export default FriendRequests;
