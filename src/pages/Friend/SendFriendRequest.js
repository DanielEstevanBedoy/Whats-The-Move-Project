import React, { useState } from 'react';
import { db, auth } from '../../utils/firebase';

function SendFriendRequest() {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const usersRef = db.ref('Users');
    usersRef.once('value', (snapshot) => {
      let recipientID = null;
      snapshot.forEach(data => {
        if (data.val().email === email) {
          recipientID = data.key;
        }
      });
      if (recipientID) {
        const friendRequestsRef = db.ref(`Users/${recipientID}/friendRequests`);
        friendRequestsRef.once('value', (friendRequestsSnapshot) => {
          const senderID = auth.currentUser.uid;
          let friendRequestExists = false;
          friendRequestsSnapshot.forEach(request => {
            if (request.val() === senderID) {
              friendRequestExists = true;
              return true; // Exit loop if friend request already exists
            }
          });
          if (!friendRequestExists) {
            friendRequestsRef.push().set(senderID);
            setEmail('');
          } else {
            console.log('Friend request already sent to this user.');
          }
        });
      } else {
        console.log('No user with the provided email found.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={handleEmailChange} placeholder="Friend's Email" required />
      <button type="submit">Send Friend Request</button>
    </form>
  );
}

export default SendFriendRequest;
