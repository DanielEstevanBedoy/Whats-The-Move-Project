import React, { useState } from 'react';
import { db, auth } from '../../utils/firebase';

function SendFriendRequest() {
    const [email, setEmail] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const usersRef = db.ref('Users');
        usersRef.once('value', (snapshot) => {
            let uid = null;
            snapshot.forEach(data => {
                if (data.val().email === email) {
                    uid = data.key;
                }
            });
            if (uid) {
                const friendRequestsRef = db.ref(`Users/${uid}/friendRequests`);
                friendRequestsRef.push(auth.currentUser.uid);
                setEmail("");
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
