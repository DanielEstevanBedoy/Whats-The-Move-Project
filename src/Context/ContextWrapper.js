import React, { useReducer, useState, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

/* Reducer function takes current state and an action, and returns the new state */
function savedEventsReducer(state, { type, payload }) {
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
    default:
      throw new Error();
  }
}

/* Initializes the state for useReducer. It retrieves events saved in localStorage, parses them, 
and returns them. If there are no events in localStorage, it returns an empty array. */
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

  /* The function passed to useEffect will run everytime savedEvents changes */
  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    if(!showEventForm) {
        setSelectedEvent(null);
    }
  }, [showEventForm]);

  /*
  useEffect(() => {
    if(selectedEvent) {
        setTitle(selectedEvent.title);
        setDescription(selectedEvent.description);
        setSelectedLabel(labels.find((lbl) => lbl === selectedEvent.label));
    } else {
        setTitle("");
        setDescription("");
        setSelectedLabel(labels[0]);
    }
}, [selectedEvent]);
*/

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
