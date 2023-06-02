import React, { useState } from 'react';
import { db } from '../../utils/firebase';
import { useAuth } from './AuthContext';

function SendFriendRequest() {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      return;
    }

    const emailKey = currentUser.email.replace('.', ',');
    const friendRequestsRef = db.ref(`friendRequests/${emailKey}`);
    friendRequestsRef.push({
      from: currentUser.email,
      to: email,
      status: 'pending'
    });

    setEmail('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={handleEmailChange} placeholder="Friend's Email" required />
      <button type="submit">Send Friend Request</button>
    </form>
  );
}

export default SendFriendRequest;
