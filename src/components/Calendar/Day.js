import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import GlobalContext from "../../Context/GlobalContext";

const colorMap200 = {
  rose: "bg-rose-200",
  fuchsia: "bg-fuchsia-200",
  violet: "bg-violet-200",
  blue: "bg-blue-200",
  cyan: "bg-cyan-200",
  emerald: "bg-emerald-200",
  lime: "bg-lime-200",
  gray: "bg-gray-200",
};

const iconColorMap700 = {
  rose: "text-rose-700",
  fuchsia: "text-fuchsia-700",
  violet: "text-violet-700",
  blue: "text-blue-700",
  cyan: "text-cyan-700",
  emerald: "text-emerald-700",
  lime: "text-lime-700",
  gray: "text-gray-700",
};

// Represent every individual item in our grid
export default function Day({ day, rowIndex }) {
  const isToday = dayjs().isSame(dayjs(day), "day");

  const [todaysEvents, setTodaysEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventForm,
    savedEvents,
    friendsEvents,
    setSelectedEvent,
    showFriendsEvents,
    closeFriendEvents,
    showCloseFriendEvents,
    canEdit,
    setCanEdit,
  } = useContext(GlobalContext);

  useEffect(() => {
    // Combining savedEvents and friendsEvents
    // const allEvents = showFriendsEvents ? [...savedEvents, ...friendsEvents] : [...savedEvents];
    let myEvents = savedEvents; // start with user's own events
    if (showFriendsEvents) {
      myEvents = [...myEvents, ...friendsEvents];
    }
    if (showCloseFriendEvents) {
      myEvents = [...myEvents, ...closeFriendEvents];
    }
    const events = myEvents.filter(
      (event) => dayjs(event.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setTodaysEvents(events);
  }, [
    savedEvents,
    friendsEvents,
    closeFriendEvents,
    day,
    showFriendsEvents,
    showCloseFriendEvents,
  ]);

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
          setCanEdit(true);
          setShowEventForm(true);
        }}
      >
        {todaysEvents.map((event, index) => (
          <div className="flex">
            {event.tag === "friend" && (
              <div
                className={
                  "material-icons-outlined -mr-1 " +
                  iconColorMap700[event.label]
                }
              >
                group
              </div>
            )}
            {event.tag === "closeFriend" && (
              <div
                className={
                  "material-icons-outlined -mr-1 " +
                  iconColorMap700[event.label]
                }
              >
                auto_awesome
              </div>
            )}
            <div
              key={index}
              onClick={() => {
                setSelectedEvent(event);
                setCanEdit(false);
              }}
              className={
                colorMap200[event.label] +
                " p-1 ml-2 text-gray-600 text-sm rounded mb-1 truncate flex-grow"
              }
            >
              {event.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
