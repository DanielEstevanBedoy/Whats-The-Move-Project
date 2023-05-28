import React from 'react';
import SendFriendRequest from './SendFriendRequest';  // assuming you have this component in the same directory
import FriendRequests from './FriendRequests';  // assuming you have this component in the same directory
import './friends.css'

function FriendsPage() {
    return (
        <div className="container">
            <h1>Friends</h1>
            <div className="SendFriendRequest">
                <h2>Send Friend Request</h2>
                <SendFriendRequest />
            </div>
            <div className="FriendRequests">
                <h2>Friend Requests</h2>
                <FriendRequests />
            </div>
        </div>
    );
}

export default FriendsPage;