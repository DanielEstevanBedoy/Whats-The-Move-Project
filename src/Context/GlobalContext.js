import React from 'react'

const GlobalContext = React.createContext(
{
    monthIndex: 0,
    setMonthIndex: () => {},
    showEventForm: false,
    setShowEventForm: () => {}
})

export default GlobalContext