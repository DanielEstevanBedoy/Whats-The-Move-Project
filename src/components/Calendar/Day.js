import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import GlobalContext from "../../Context/GlobalContext";

const colorMap200 = {
  gray: "bg-gray-200",
  blue: "bg-blue-200",
  indigo: "bg-indigo-200",
  green: "bg-green-200",
  red: "bg-red-200",
  purple: "bg-purple-200",
};

// Represent every individual item in our grid
export default function Day({ day, rowIndex }) {
  const isToday = dayjs().isSame(dayjs(day), "day");

  const [todaysEvents, setTodaysEvents] = useState([]);
  const { setDaySelected, setShowEventForm, savedEvents, setSelectedEvent } =
    useContext(GlobalContext);

  useEffect(() => {
    const events = savedEvents.filter(
      (event) => dayjs(event.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setTodaysEvents(events);
  }, [savedEvents, day]);

  return (
    <div className="border border-gray-200 flex flex-col">
      <header className="flex flex-col items-center">
        {rowIndex === 0 && (
          <p className="text-sm mt-1"> {day.format("ddd").toUpperCase()} </p>
        )}
        <p
          className={`text-sm p-1 my-1 text-center ${
            isToday ? "bg-blue-500 text-white rounded-full w-7" : ""
          }`}
        >
          {day.format("D") === "1" ? day.format("MMM D") : day.format("D")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setShowEventForm(true);
        }}
      >
        {todaysEvents.map((event, index) => (
          <div
            key={index}
            onClick={() => setSelectedEvent(event)}
            className={
              colorMap200[event.label] +
              " p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate"
            }
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}
