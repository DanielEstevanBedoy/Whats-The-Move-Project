import React from 'react';
import SendFriendRequest from './SendFriendRequest';
import FriendRequests from './FriendRequests';
import CurrentFriends from './CurrentFriends';
import './friends.css';

function FriendsPage() {
  return (
    <div>
      <h1>Friends</h1>
      <h2>Send Friend Request</h2>
      <SendFriendRequest />
      <h2>Friend Requests</h2>
      <FriendRequests />
      <CurrentFriends />
    </div>
  );
}

export default FriendsPage;
