import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../../utils/firebase';

function FriendRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const email = currentUser.email.replace('.', ',');
      const friendRequestsRef = db.ref(`friendRequests/${email}`);
      friendRequestsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const requestsArray = [];
        for (let key in data) {
          requestsArray.push(data[key]);
        }
        setRequests(requestsArray);
      });
    }
  }, [currentUser]);

  return (
    <div>
      <h1>Friend Requests</h1>
      {requests.map((request, index) => (
        <div key={index}>
          <p>From: {request.from}</p>
          <p>Status: {request.status}</p>
        </div>
      ))}
    </div>
  );
}

export default FriendRequests;
