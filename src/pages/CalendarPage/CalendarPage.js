import "./CalendarPage.css";
import React, { useState, useContext, useEffect } from "react";
import { getMonth } from "../../util";
import CalendarHeader from "../../components/Calendar/CalendarHeader";
import Month from "../../components/Calendar/Month";
import CalendarSidebar from "../../components/Calendar/CalendarSidebar";
import GlobalContext from "../../Context/GlobalContext";
import EventForm from "../../components/Calendar/EventForm";

function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());

  /* Reading from the global context */
  const { monthIndex } = useContext(GlobalContext);

  useEffect(
    () => {
      setCurrentMonth(monthIndex);
    },
    [monthIndex]
  );

  const {showEventForm, setShowEventForm} = useContext(GlobalContext);

  return (
    <>
      {showEventForm && <EventForm />}
      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <CalendarSidebar />
          <Month month={currentMonth} />
        </div>
      </div>
    </>
  );
}

export default CalendarPage;
