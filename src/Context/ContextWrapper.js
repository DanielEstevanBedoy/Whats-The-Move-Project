import React, { useReducer, useState, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

/* Reducer function takes current state and an action, and returns the new state */
function savedEventsReducer(state, { type, eventData }) {
  const ADD_EVENT = "ADD_EVENT"
  const REMOVE_EVENT = "REMOVE_EVENT"
  const UPDATE_EVENT = "UPDATE_EVENT"

  switch (type) {
    case ADD_EVENT:
      // returns a new state that includes all the previous events plus the new event from eventData 
      return [...state, eventData];
    case REMOVE_EVENT:
      // returns a new state that includes all events except for the one that matches the id in eventData
      return state.filter((event) => event.id !== eventData.id);
    case UPDATE_EVENT:
      // returns a new state where the event with id matching eventData is replaced with event in eventData
      return state.map((event) => (event.id === eventData.id ? eventData : event));
    default:
      throw new Error();
  }
}

/* Initializes the state for useReducer. When the application loads, it checks localStorage
for previously saved events. If it finds any, it retrieves events saved in localStorage, parses them,
 and loads them into the applciation state. If there are no events in localStorage, it returns an 
 empty array. */
function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
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

  const [savedEvents, dispatchEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );

  /* The function passed to useEffect will run everytime savedEvents changes. 
  When you create or update events, these are stored in localStorage under the 
  key "savedEvents". 
  */
  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
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
