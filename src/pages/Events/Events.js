import React, { useEffect, useState } from 'react';
import { auth, db } from '../../utils/firebase'; // Update the path to your Firebase configuration file
import { ref, push, set,get, onValue } from 'firebase/database';
//import FriendNotifications from '../Friend/FriendNotifications/';

function Events() {
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const eventsRef = ref(db, `Users/${currentUser.uid}/Events`);
      onValue(eventsRef, (snapshot) => {
        const eventsData = snapshot.val();
        if (eventsData) {
          const eventsList = Object.entries(eventsData).map(([id, event]) => ({
            id,
            ...event
          }));
          setEvents(eventsList);
        }
      });
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


  const handleCreateEvent = async () => {
    if (eventName && eventDate && eventTime) {
      const eventId = push(ref(db, `Users/${currentUser.uid}/Events`)).key;
  
      const eventData = {
        name: eventName,
        date: eventDate,
        time: eventTime,
        userId: currentUser.uid,
      };
  
      // Add the event to the user's events
      await set(ref(db, `Users/${currentUser.uid}/Events/${eventId}`), eventData);
  
      // Fetch the user's friends
      const snapshot = await get(ref(db, `Users/${currentUser.uid}/friends`));
      const friends = snapshot.val();
  
      // For each friend, add a notification
      for (let friendId in friends) {
        // Fetch the friend's name
        const friendSnapshot = await get(ref(db, `Users/${friendId}/displayName`));
        const friendName = friendSnapshot.val();
  
        const notificationId = push(ref(db, `Users/${friendId}/notifications`)).key;
        const notificationData = {
          from: friendName, // Now it's the friend's name instead of their userId
          event: eventName,
        };
        await set(ref(db, `Users/${friendId}/notifications/${notificationId}`), notificationData);
      }
  
      setEventName('');
      setEventDate('');
      setEventTime('');
    } else {
      console.log('Please enter all event details');
    }
  };
  
  
  
  return (
    <div>
    
      <h2>Events page</h2>
      
      {/* Display notifications */}
      <div>
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id}>
              <p>You have been invited to the event "{notification.event}" by {notification.from}</p>
            </div>
          ))
        )}
      </div>
      
            <div>
        {events.map((event) => (
          <div key={event.id}>
            <h3>{event.name}</h3>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
          </div>
        ))}
      </div>
      <div>
        <label>Event Name:</label>
        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
      </div>
      <div>
        <label>Event Date:</label>
        <input type="text" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
      </div>
      <div>
        <label>Event Time:</label>
        <input type="text" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
      </div>
      
        
      <button onClick={handleCreateEvent}>Create Event</button>
    </div>
  );
}

export default Events;
