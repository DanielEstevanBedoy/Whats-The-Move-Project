import React, { useReducer, useState, useEffect } from "react";
import {
  ref,
  set,
  update,
  get,
  remove,
  child,
  onValue,
  off,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

/* Reducer function takes current state and an action, and returns the new state */
function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "ADD_EVENT":
      if (auth.currentUser) {
        const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
        set(userEventsRef, payload); // Directly save the new event in Firebase
      }
      return [...state, payload];

    case "REMOVE_EVENT":
      if (auth.currentUser) {
        const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
        const eventToRemoveRef = child(userEventsRef, payload.id);
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
        parsedEvents = Object.keys(data).map((key) => {
          return {
            ...data[key],
            id: key, // Ensure the id is included in each event
          };
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
  const [isLoading, setIsLoading] = useState(true);

  const [savedEvents, dispatchEvent] = useReducer(savedEventsReducer, []);
  const [friendsEvents, setFriendsEvents] = useState([]);

  /* The function passed to useEffect will run everytime savedEvents changes. 
  When you create or update events, these are stored in localStorage under the 
  key "savedEvents". 
  */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoading(true); // set isLoading to true right before you start fetching data
      if (user) {
        // User is signed in, fetch the events
        initEvents().then((events) => {
          dispatchEvent({ type: "INIT_EVENTS", payload: events });
          setIsLoading(false);
        });
      } else {
        // No user is signed in, clear the events
        dispatchEvent({ type: "CLEAR_EVENTS" });
        setIsLoading(false);
      }
    });
    return () => {
      setIsLoading(true); // set isLoading to true when the component unmounts
    };
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

  useEffect(() => {
    if (auth.currentUser) {
      setIsLoading(true); // Set loading to true before starting to fetch
      const userFriendsRef = ref(db, `Users/${auth.currentUser.uid}/friends`);
      const friendsListListener = onValue(userFriendsRef, (snapshot) => {
        const friendsList = snapshot.val();
        if (friendsList) {
          const friendsEventsFetches = Object.keys(friendsList).map(
            (friendId) => {
              const friendEventsRef = ref(db, `Users/${friendId}/Events`);
              return get(friendEventsRef).then((snapshot) => {
                const friendEvents = snapshot.val() || {};
                return Object.keys(friendEvents).map((key) => {
                  return {
                    ...friendEvents[key],
                    id: key, // Ensure the id is included in each event
                  };
                });
              });
            }
          );
          Promise.all(friendsEventsFetches).then((friendsEventsArrays) => {
            const combinedFriendsEvents = [].concat(...friendsEventsArrays);
            setFriendsEvents(combinedFriendsEvents);
            setIsLoading(false); // Set loading to false after the data is fetched
          });
        } else {
          setFriendsEvents([]);
          setIsLoading(false); // And here as well
        }
      });

      // Cleanup function to remove listener
      return () => {
        off(userFriendsRef, friendsListListener);
      };
    } else {
      setFriendsEvents([]);
      setIsLoading(false); // And here
    }
  }, [auth.currentUser]);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
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
        friendsEvents,
        setFriendsEvents,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
