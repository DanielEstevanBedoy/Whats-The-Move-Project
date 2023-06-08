import { useContext, useState, useEffect } from "react";
// import { getMonth } from "../../util";
import dayjs from "dayjs";
import CalendarHeader from "../../components/Calendar/CalendarHeader";
import Month from "../../components/Calendar/Month";
import CalendarSidebar from "../../components/Calendar/CalendarSidebar";
import GlobalContext from "../../Context/GlobalContext";
import EventForm from "../../components/Calendar/EventForm";

function getMonth(monthIndex = dayjs().month()) {
  const currentYear = dayjs().year();

  const startOfMonth = dayjs(new Date(currentYear, monthIndex, 1));
  const startOfWeek = startOfMonth.startOf("week");

  let currentDay = startOfWeek;
  let daysMatrix = [];
  let week = [];

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      week.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }
    daysMatrix.push(week);
    week = [];

    if (currentDay.month() > monthIndex) break;
  }

  return daysMatrix;
}

function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());

  /* Accessing the value of GlobalContext */
  const { monthIndex, showEventForm } = useContext(GlobalContext);

  /* The function passed to useEffect will run everytime monthIndex changes*/
  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

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
