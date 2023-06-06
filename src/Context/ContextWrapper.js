import React, { useReducer, useState, useEffect } from "react";
import { ref, set, update, get, remove, child, push, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

/* Reducer function takes current state and an action, and returns the new state */
/* Reducer function takes current state and an action, and returns the new state */
function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "ADD_EVENT":
      if (auth.currentUser) {
        const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
        set(userEventsRef, payload.event);  // Directly save the new event in Firebase

        // Friends
        const friendEventsPromises = payload.friends.map((friendId) => {
          const friendEventsRef = ref(db, `Users/${friendId}/SharedEvents`);
          return set(friendEventsRef, payload.event);
        });
    
        Promise.all(friendEventsPromises).catch((error) => {
          console.error("Error adding event to friends:", error);
        });
      }
      return [...state.events, payload.event];

    case "REMOVE_EVENT":
      if (auth.currentUser) {
        const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
        const eventToRemoveRef = child(userEventsRef, payload.id);
        remove(eventToRemoveRef);

        const friendEventsPromises = payload.friends.map((friendId) => {
          const friendEventsRef = ref(db, `Users/${friendId}/SharedEvents`);
          const eventToRemoveRef = child(friendEventsRef, payload.id);
          return remove(eventToRemoveRef);
        });
        Promise.all(friendEventsPromises).catch((error) => {
          console.error("Error removing event from friends:", error);
        });
      }
      return state.filter((event) => event.id !== payload.id);
      
    case "UPDATE_EVENT":
      if (auth.currentUser) {
        const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
        const eventToUpdateRef = child(userEventsRef, payload.id);
        update(eventToUpdateRef, payload);
      }
      return state.map((event) => (event.id === payload.id ? payload : event));

    case "INIT_EVENTS":
      return {
        events: payload.events,
        friends: payload.friends,
      };

    case "CLEAR_EVENTS":
      return [];

    default:
      throw new Error();
  }
}


/* Initializes the state for useReducer. It retrieves events saved in the realtime database, parses them, 
and returns them. If there are no events in localStorage, it returns an empty array. */
async function initEvents() {
  if (auth.currentUser) {
    const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
    let parsedEvents = [];
    const friendsRef = ref(db, `Users/${auth.currentUser.uid}/friends`);
    let friends = [];

    // Retrieve user's events
    await get(userEventsRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        parsedEvents = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
      }
    });

    // Retrieve friends' information
    await get(friendsRef).then((snapshot) => {
      const friendsData = snapshot.val();
      if (friendsData) {
        const friendIds = Object.keys(friendsData).filter(
          (key) => friendsData[key]
        );
        const promises = friendIds.map((friendId) => {
          return new Promise((resolve) => {
            const friendRef = ref(db, `Users/${friendId}`);
            onValue(friendRef, (friendSnapshot) => {
              const friendData = friendSnapshot.val();
              if (friendData) {
                resolve({
                  id: friendId,
                  name: friendData.displayName,
                  photoURL: friendData.photoURL,
                });
              } else {
                console.warn(`Friend data for friendID ${friendId} is not available.`);
                resolve(null);
              }
            });
          });
        });
        Promise.all(promises).then((friendData) => {
          friends = friendData.filter((friend) => friend !== null);
        });
      }
    });

    return { events: parsedEvents, friends };
  } else {
    console.log("No user is signed in");
    return [];
  }
}

/* These values are now accessible by the useContext hook */
export default function ContextWrapper(props) {
  /**
   * We are creating a piece of state, and a function to update that state.
   * Then, we are providing these values to all child components via the context provider.
   * We must store our state somewhere.
   */

  const [initialized, setInitialized] = useState(true);
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [savedEvents, dispatchEvent] = useReducer(savedEventsReducer, []);

  /* The function passed to useEffect will run everytime savedEvents changes. 
  When you create or update events, these are stored in localStorage under the 
  key "savedEvents". 
  */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, fetch the events
        initEvents().then(events => {
          dispatchEvent({ type: "INIT_EVENTS", payload: events });
          setInitialized(true);
        });
      } else {
        // No user is signed in, clear the events
        dispatchEvent({ type: "CLEAR_EVENTS" });
      }
    });
  }, []);

  useEffect(() => {
    if (initialized && auth.currentUser) {
      const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
      get(userEventsRef).then((snapshot) => {
        // Check if the user has any events in the database
        set(userEventsRef, savedEvents);
        // if (data) {
        //   // If they do, update the events with the current savedEvents
        //   update(userEventsRef, savedEvents);
        // } else {
        //   // If they don't, set the events to the current savedEvents
        // }
      });
    }
  }, [savedEvents, initialized]);
  

  useEffect(() => {
    if (!showEventForm) {
      setSelectedEvent(null);
    }
  }, [showEventForm]);

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        daySelected,
        setDaySelected,
        showEventForm,
        setShowEventForm,
        dispatchEvent,
        savedEvents,
        selectedEvent,
        setSelectedEvent,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
