import React from 'react'

const GlobalContext = React.createContext(
{
    monthIndex: 0,
    setMonthIndex: () => {},
    daySelected: null,
    setDaySelected: (day) => {},
    showEventForm: false,
    setShowEventForm: () => {}
})

export default GlobalContext