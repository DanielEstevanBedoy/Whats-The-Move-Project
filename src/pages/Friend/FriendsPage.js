import React from 'react';
import SendFriendRequest from './SendFriendRequest';
import FriendRequests from './FriendRequests';
import CurrentFriends from './CurrentFriends';
// import './friends.css';

function FriendsPage() {
  return (
    <div>
      <SendFriendRequest />
      <FriendRequests />
      <CurrentFriends />
    </div>
  );
}

export default FriendsPage;
