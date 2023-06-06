import React from 'react';
import SendFriendRequest from './SendFriendRequest';
import FriendRequests from './FriendRequests';
import CurrentFriends from './CurrentFriends';
import CloseFriends from './CloseFriends';
// import './friends.css';

function FriendsPage() {
  return (
    <div>
      <SendFriendRequest />
      <FriendRequests />
      <CloseFriends />
      <CurrentFriends />
    </div>
  );
}

export default FriendsPage;
