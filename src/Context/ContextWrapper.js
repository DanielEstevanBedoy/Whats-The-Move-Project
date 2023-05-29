import React, { useState } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";
/* These values are now accessible by the useContext hook */

export default function ContextWrapper(props) {
  /**
   * We are creating a piece of state, and a function to update that state.
   * Then, we are providing these values to all child components via the context provider.
   * We must store our state somewhere. 
   */
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [showEventForm, setShowEventForm] = useState(false);
  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        showEventForm,
        setShowEventForm,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
