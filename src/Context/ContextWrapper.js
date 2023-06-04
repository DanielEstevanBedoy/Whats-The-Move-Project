import React, { useReducer, useState, useEffect } from "react";
import { ref, set, update, get, push, remove, child } from "firebase/database";
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
        set(userEventsRef, payload);  // Directly save the new event in Firebase
      }
      return [...state, payload];

    case "REMOVE_EVENT":
      if (auth.currentUser) {
        const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
        const eventToRemoveRef = child(userEventsRef, payload);
        remove(eventToRemoveRef);
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
      return payload;

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
    await get(userEventsRef).then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert the object into an array of events
          parsedEvents = Object.keys(data).map(key => {
            return {
              ...data[key],
              id: key // Ensure the id is included in each event
            }
          });
        }
    });
    return parsedEvents;
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
        const data = snapshot.val();
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
    if(!showEventForm) {
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
