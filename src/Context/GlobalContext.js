import React from "react";

const GlobalContext = React.createContext({
    monthIndex: 0,
    setMonthIndex: () => {},
    daySelected: null,
    setDaySelected: (day) => {},
    showEventForm: false,
    setShowEventForm: () => {},
    dispatchEvent: ({ type, payload }) => {},
    savedEvents: [],
    selectedEvent: null,
    setSelectedEvent: () => {},
    friendsEvents: [],
    setFriendsEvents: () => {},
    //   isloading: true,
    showFriendsEvents: true,  // set default to true
    setShowFriendsEvents: () => {},
});

export default GlobalContext;
