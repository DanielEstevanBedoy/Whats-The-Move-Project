import React, { useEffect, useState } from 'react';
import { auth, db } from '../../utils/firebase'; // Update the path to your Firebase configuration file
import { ref, push, set, onValue } from 'firebase/database';

function Events() {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
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
    }
  }, [currentUser]);

  const handleCreateEvent = () => {
    if (eventName && eventDate && eventDescription) {
      const eventId = push(ref(db, `Users/${currentUser.uid}/Events`)).key;
  
      const eventData = {
        name: eventName,
        date: eventDate,
        description: eventDescription,
        userId: currentUser.uid
      };
  
      set(ref(db, `Users/${currentUser.uid}/Events/${eventId}`), eventData)
        .then(() => {
          console.log('Event created successfully!');
          setEventName('');
          setEventDate('');
          setEventDescription('');
        })
        .catch((error) => {
          console.error('Error creating event:', error);
        });
    } else {
      console.log('Please enter all event details');
    }
  };
  
  return (
    <div>
      <h2>Events page</h2>
      <div>
        {events.map((event) => (
          <div key={event.id}>
            <h3>{event.name}</h3>
            <p>Date: {event.date}</p>
            <p>Description: {event.time}</p>
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
        <label>Event Description:</label>
        <input type="text" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
      </div>
      <button onClick={handleCreateEvent}>Create Event</button>
    </div>
  );
}

export default Events;
