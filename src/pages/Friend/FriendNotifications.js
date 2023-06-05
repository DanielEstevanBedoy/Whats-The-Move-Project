import React, { useEffect, useState } from 'react';
import { auth, db } from '../../utils/firebase';
import { ref, onValue } from 'firebase/database';

function FriendNotifications() {
  const [notifications, setNotifications] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const notificationsRef = ref(db, `Users/${currentUser.uid}/notifications`);
      onValue(notificationsRef, (snapshot) => {
        const notificationsData = snapshot.val();
        if (notificationsData) {
          const notificationsList = Object.entries(notificationsData).map(([id, notification]) => ({
            id,
            ...notification
          }));
          setNotifications(notificationsList);
        }
      });
    }
  }, [currentUser]);

  return (
    <div>
    <h2>Notifications</h2>
    {notifications.length ? (
      notifications.map((notification) => (
        <p key={notification.id}>
          You have been invited to the event "{notification.event}" by {notification.from}
        </p>
      ))
    ) : (
      <p>You have no new notifications.</p>
    )}
  </div>
  );
}

export default FriendNotifications;
