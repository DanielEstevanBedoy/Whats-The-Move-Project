import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../../Context/GlobalContext";
import { auth } from "../../utils/firebase";

function Notification() {
  const { friendsEvents } = useContext(GlobalContext);
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser && friendsEvents) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);  // set the time to 00:00:00

      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7); // add 7 days to today

      const notificationsList = friendsEvents
        .filter((event) => {
          // convert the Unix timestamp into a date object
          const eventDate = new Date(event.day);

          // only include the notification if the event date is between today and seven days from now
          return eventDate >= today && eventDate <= sevenDaysLater;
        })
        .map((event) => ({
          id: event.id,
          from: event.userName,
          title: event.title,
          day: event.day
        }));

      setNotifications(notificationsList);
      setIsVisible(true);
    }
  }, [currentUser, friendsEvents]);

  useEffect(() => {
    if (notifications.length) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  const containerStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    borderRadius: '10px',
    backgroundColor: '#e1f5fe',
    padding: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  const notificationStyle = {
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      {notifications.map((notification) => (
        <div style={notificationStyle} key={notification.id}>
          {notification.from} has created a new event: "{notification.title}"
        </div>
      ))}
    </div>
  );
}

export default Notification;
