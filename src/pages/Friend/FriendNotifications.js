import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import { ref, onValue } from "firebase/database";

function FriendNotifications() {
  const [notifications, setNotifications] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const notificationsRef = ref(
        db,
        `Users/${currentUser.uid}/notifications`
      );
      onValue(notificationsRef, (snapshot) => {
        const notificationsData = snapshot.val();
        if (notificationsData) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);  // set the time to 00:00:00

          const notificationsList = Object.entries(notificationsData)
            .filter(([, notification]) => {
              // convert the Unix timestamp into a date object
              const eventDate = new Date(notification.day);

              // only include the notification if the event date is today or in the future
              return eventDate >= today;
            })
            .map(([id, notification]) => ({
              id,
              ...notification,
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
            You have been invited to the event "{notification.title}" by{" "}
            {notification.from}
          </p>
        ))
      ) : (
        <p>You have no new notifications.</p>
      )}
    </div>
  );
}

export default FriendNotifications;
