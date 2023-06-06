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
    
    // Friend Contexts
    friendsEvents: [],
    setFriendsEvents: () => {},
    showFriendsEvents: true,  // set default to true
    setShowFriendsEvents: () => {},

    // Close Friend Contexts
    closeFriendEvents: [],
    setCloseFriendEvents: () => {},
    showCloseFriendEvents: true,  // set default to true
    setShowCloseFriendEvents: () => {},

});

export default GlobalContext;
