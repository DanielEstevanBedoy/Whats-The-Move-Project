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
    
    // User
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

    // Friends events
    return parsedEvents;
  } else {
    console.log("No user is signed in");
    return [];
  }
}

async function initFriendsEvents() {
  if (auth.currentUser) {
    const userFriendsRef = ref(db, `Users/${auth.currentUser.uid}/friends`);
    let parsedFriendsEvents = [];
    await get(userFriendsRef).then(async (snapshot) => {
      const friendsList = snapshot.val();
      if (friendsList) {
        const friendsEventsFetches = Object.keys(friendsList).map(
          (friendId) => {
            const friendEventsRef = ref(db, `Users/${friendId}/Events`);
            return get(friendEventsRef).then((snapshot) => {
              const friendEvents = snapshot.val() || {};
              return Object.keys(friendEvents).filter(key => friendEvents[key].visibility === 'Public').map((key) => {
                return {
                  ...friendEvents[key],
                  id: key,
                };
              });
            });
          }
        );
        const friendsEventsArrays = await Promise.all(friendsEventsFetches);
        const combinedFriendsEvents = [].concat(...friendsEventsArrays);
        parsedFriendsEvents = combinedFriendsEvents;
      }
    });
    return parsedFriendsEvents;
  } else {
    console.log("No user is signed in");
    return [];
  }
}

async function initCloseFriendEvents() {
  if (auth.currentUser) {
    const userFriendsRef = ref(db, `Users/${auth.currentUser.uid}/friends`);

    let parsedCloseFriendEvents = [];
    await get(userFriendsRef).then(async(snapshot) => {
      const friendsList = snapshot.val();
      if (friendsList) {
        const friendsEventsFetches = Object.keys(friendsList).map(
          async (friendId) => {
            const friendCloseFriendsRef = ref(db, `Users/${friendId}/closeFriends`);
            const friendCloseFriendsSnapshot = await get(friendCloseFriendsRef);
            const friendCloseFriends = friendCloseFriendsSnapshot.val() || {};

            if (friendCloseFriends.hasOwnProperty(auth.currentUser.uid)) {
              // If the current user is a close friend, fetch the friend's events
              const friendEventsRef = ref(db, `Users/${friendId}/Events`);
              return get(friendEventsRef).then((snapshot) => {
                const friendEvents = snapshot.val() || {};
                // Only fetch events where visibility is set to 'Close Friends'
                return Object.keys(friendEvents).filter(key => friendEvents[key].visibility === 'Close Friends').map(key => {
                  return {
                    ...friendEvents[key],
                    id: key,
                  };
                });
              });
            } else {
              // If the current user is not a close friend, don't fetch any events
              return [];
            }
          }
        );

        const friendsEventsArrays = await Promise.all(friendsEventsFetches);
        const combinedFriendsEvents = [].concat(...friendsEventsArrays);
        parsedCloseFriendEvents = combinedFriendsEvents;
      }
    });

    // Friends events
    return parsedCloseFriendEvents;

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
  const [showFriendsEvents, setShowFriendsEvents] = useState(true);
  const [showCloseFriendEvents, setShowCloseFriendEvents] = useState(true);
  const [initialized, setInitialized] = useState(true);
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [savedEvents, dispatchEvent] = useReducer(savedEventsReducer, []);
  const [friendsEvents, setFriendsEvents] = useState([]);
  const [closeFriendEvents, setCloseFriendEvents] = useState([]);
  

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
  
  
  
  // this useEffect will handle friends events only
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoading(true); // set isLoading to true right before you start fetching data
      if (user) {
        // User is signed in, fetch the friends' events
        initFriendsEvents().then((events) => {
          setFriendsEvents(events);
          setIsLoading(false);
        });
      } else {
        // No user is signed in, clear the events
        setFriendsEvents([]);
        setIsLoading(false);
      }
    });
    return () => {
      setIsLoading(true); // set isLoading to true when the component unmounts
    };
  }, []);

  // this useEffect will handle close friend events only
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoading(true); // set isLoading to true right before you start fetching data
      if (user) {
        // User is signed in, fetch the close friends' events
        initCloseFriendEvents().then((events) => {
          setCloseFriendEvents(events);
          setIsLoading(false);
        });
      } else {
        // No user is signed in, clear the events
        setCloseFriendEvents([]);
        setIsLoading(false);
      }
    });
    return () => {
      setIsLoading(true); // set isLoading to true when the component unmounts
    };
  }, []);

  // Fetch User events
  useEffect(() => {
    if (initialized && auth.currentUser) {
      const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
      get(userEventsRef).then((snapshot) => {
        // Check if the user has any events in the database
        set(userEventsRef, savedEvents);
      });
    }
  }, [savedEvents, initialized]);

  useEffect(() => {
      if (!showEventForm) {
        setSelectedEvent(null);
      }
    }, [showEventForm]);
  
  // Fetch friends
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
                // Filtering the events based on their visibility
                const publicEvents = Object.keys(friendEvents).reduce((filtered, key) => {
                  if (friendEvents[key].visibility === "Public") {
                    filtered.push({
                      ...friendEvents[key],
                      id: key,
                    });
                  }
                  return filtered;
                }, []);
                return publicEvents;
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
  


  // Fetching close friends
  useEffect(() => {
    if (auth.currentUser) {
      setIsLoading(true);
      const userFriendsRef = ref(db, `Users/${auth.currentUser.uid}/friends`);
      const friendsListListener = onValue(userFriendsRef, async (snapshot) => {
        const friendsList = snapshot.val();
        if (friendsList) {
          const friendsEventsFetches = Object.keys(friendsList).map(
            async (friendId) => {
              const friendCloseFriendsRef = ref(db, `Users/${friendId}/closeFriends`);
              const friendCloseFriendsSnapshot = await get(friendCloseFriendsRef);
              const friendCloseFriends = friendCloseFriendsSnapshot.val() || {};
  
              if (friendCloseFriends.hasOwnProperty(auth.currentUser.uid)) {
                const eventsRef = ref(db, `Users/${friendId}/Events`);
                return get(eventsRef).then((snapshot) => {
                  const events = snapshot.val() || {};
                  const closeFriendEvents = Object.keys(events).reduce((filtered, key) => {
                    if (events[key].visibility === "Close Friends") {
                      filtered.push({
                        ...events[key],
                        id: key,
                      });
                    }
                    return filtered;
                  }, []);
                  return closeFriendEvents;
                });
              } else {
                return [];
              }
            }
          );
  
          Promise.all(friendsEventsFetches).then((friendsEventsArrays) => {
            const combinedFriendsEvents = [].concat(...friendsEventsArrays);
            setCloseFriendEvents(combinedFriendsEvents);
            setIsLoading(false);
          });
        } else {
          setCloseFriendEvents([]);
          setIsLoading(false);
        }
      });
  
      return () => {
        off(userFriendsRef, friendsListListener);
      };
    } else {
      setCloseFriendEvents([]);
      setIsLoading(false);
    }
  }, [auth.currentUser]);
  

    // Cool Button go BRRRRRR in CurrentFriends Component
    const [isCloseFriend, setIsCloseFriend] = useState([]);
    

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
        showFriendsEvents,
        setShowFriendsEvents,
        closeFriendEvents,
        setCloseFriendEvents,
        showCloseFriendEvents,
        setShowCloseFriendEvents,
        isCloseFriend, 
        setIsCloseFriend
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
