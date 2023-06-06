import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {db, auth} from "../../utils/firebase"
import {
  getDatabase,
  ref,
  onValue,
  off,
  remove,
  child,
  update,
} from "firebase/database";

function CurrentFriends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  //const db = getDatabase();
  //const auth = getAuth();

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const friendsRef = ref(db, `Users/${user.uid}/friends`);
        const dbUnsubscribe = onValue(friendsRef, (snapshot) => {
          const friendsData = snapshot.val();
          if (friendsData) {
            const friendIds = Object.keys(friendsData).filter(
              (key) => friendsData[key]
            );
            const promises = friendIds.map((friendId) => {
              return new Promise((resolve) => {
                const friendRef = ref(db, `Users/${friendId}`);
                onValue(friendRef, (friendSnap) => {
                  const friendUserData = friendSnap.val();
                  if (friendUserData) {
                    resolve({
                      id: friendId,
                      name: friendUserData.displayName,
                      photoURL: friendUserData.photoURL,
                    });
                  } else {
                    console.warn(
                      `User data for friendID ${friendId} is not available.`
                    );
                  }
                });
              });
            });
            Promise.all(promises).then((friendData) => {
              setFriends(friendData);
              setLoading(false);
            });
          } else {
            setFriends([]);
            setLoading(false);
          }
        });
        return () => {
          dbUnsubscribe();
        };
      } else {
        setFriends([]);
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
    };
  }, [auth, db]);

  // const handleRemoveFriend = async (friendId) => {
  //   if (window.confirm('Are you sure you want to remove this friend?')) {
  //     const currentUserID = auth.currentUser.uid;
  //     const currentUserFriendsRef = ref(db, `Users/${currentUserID}/friends`);
  //     const friendFriendsRef = ref(db, `Users/${friendId}/friends`);

  //     await Promise.all([
  //       remove(child(currentUserFriendsRef, friendId)),
  //       remove(child(friendFriendsRef, currentUserID))
  //     ]);
  //   }
  // };

  const handleRemoveFriend = async (friendId) => {
    if (window.confirm("Are you sure you want to remove this friend?")) {
      const currentUserID = auth.currentUser.uid;

      const updates = {};
      updates[`Users/${currentUserID}/friends/${friendId}`] = null;
      updates[`Users/${friendId}/friends/${currentUserID}`] = null;

      await update(ref(db), updates);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded shadow-lg p-6 mt-6">
      <h1 className="text-xl font-bold text-blue-500 mb-4">Current Friends</h1>
      {friends.length > 0 ? (
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
          {friends.map((friend) => (
            <div key={friend.id} className="my-2 flex items-center">
              <img
                src={friend.photoURL}
                alt={friend.name}
                referrerpolicy="no-referrer"
                className="w-10 h-10 rounded-full mr-4"
              />
              <span className="mr-4">{friend.name}</span>
              <button
                onClick={() => handleRemoveFriend(friend.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You have no friends.</p>
      )}
    </div>
  );
}

export default CurrentFriends;
