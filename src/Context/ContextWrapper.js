import React, { useReducer, useState, useEffect } from "react";
import { ref, set } from "firebase/database";
import { auth, db } from "../utils/firebase";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

/* Reducer function takes current state and an action, and returns the new state */
function savedEventsReducer(state, { type, payload }) {
  const ADD_EVENT = "ADD_EVENT"
  const REMOVE_EVENT = "REMOVE_EVENT"
  const UPDATE_EVENT = "UPDATE_EVENT"

  switch (type) {
    case "ADD_EVENT":
      return [...state, payload];
      break;
    case "REMOVE_EVENT":
      // remove an event from the state where the event id matches the payload id
      return state.filter((event) => event.id !== payload.id);
      break;
    case "UPDATE_EVENT":
      // update an event in the state where the event id matches the payload id
      return state.map((event) => (event.id === payload.id ? payload : event));
    case "INIT_EVENTS":
      return payload;
    default:
      throw new Error();
  }
}

/* Initializes the state for useReducer. It retrieves events saved in localStorage, parses them, 
and returns them. If there are no events in localStorage, it returns an empty array. */
async function initEvents() {
  if (auth.currentUser) {
    const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
    let parsedEvents = [];
    await userEventsRef.once('value', (snapshot) => {
        const data = snapshot.val();
        parsedEvents = data ? Object.values(data) : [];
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
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [savedEvents, dispatchEvent] = useReducer(savedEventsReducer, []);
  useEffect(() => {
    initEvents().then(events => dispatchEvent({ type: "INIT_EVENTS", payload: events }));
  }, []);

  /* The function passed to useEffect will run everytime savedEvents changes */
  // useEffect(() => {
  //   localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  // }, [savedEvents]);

  useEffect(() => {
    if (auth.currentUser) {
      const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
      set(userEventsRef, savedEvents);
    }
  }, [savedEvents]);
  

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
