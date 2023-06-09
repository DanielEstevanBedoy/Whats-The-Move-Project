import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../../Context/GlobalContext";
import dayjs from "dayjs";
import { get, ref } from "firebase/database";
import { db } from "../../utils/firebase";
import { Route, Routes, Link } from "react-router-dom";

export default function UpcomingEvents() {
  const { isLoading, savedEvents, friendsEvents, closeFriendEvents } =
    useContext(GlobalContext);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateSearchTerm, setDateSearchTerm] = useState("");
  const day = dayjs();

  function compareGT(a, b) {
    if (a.day < b.day) return 1;
    if (a.day > b.day) return -1;
    return 0;
  }

  function compareLT(a, b) {
    return -compareGT(a, b);
  }

  useEffect(() => {
    const allEvents = savedEvents
      .concat(friendsEvents)
      .concat(closeFriendEvents);

    const events = allEvents.filter(
      (event) => dayjs(event.day).format("YYYYMMDD") >= day.format("YYYYMMDD")
    );
    events.sort(compareLT);
    setUpcomingEvents(events);
  }, [day.format("YYYYMMDD"), savedEvents, friendsEvents, closeFriendEvents]);

  if (isLoading) {
    return <p>Loading events...</p>;
  }

  return (
    <div className="flex justify-center h-screen bg-white mb-4">
      <div className="flex flex-col items-center h-full w-1/2 overflow-y-scroll pr-0">
        <h1 className="text-4xl text-blue-500 my-8">Upcoming Events</h1>

        <div className="flex justify-between mb-6 w-full">
          <div className="relative rounded-md shadow-sm mb-6 w-1/2 mr-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="material-icons-outlined text-gray-400">
                search
              </span>
            </span>
            <input
              type="text"
              placeholder="Search by user name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full pr-12 sm:text-sm rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="relative rounded-md shadow-sm mb-6 w-1/2 ml-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="material-icons-outlined text-gray-400">
                event
              </span>
            </span>
            <input
              type="text"
              placeholder="Search by date (e.g., Mon, Jan 1)"
              value={dateSearchTerm}
              onChange={(e) => setDateSearchTerm(e.target.value)}
              className="pl-10 block w-full pr-12 sm:text-sm rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {upcomingEvents
          .filter((event) =>
            event.userName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .filter(
            (event) =>
              dayjs(event.day)
                .format("ddd, MMM D")
                .toLowerCase()
                .includes(dateSearchTerm.toLowerCase()) ||
              dayjs(event.day)
                .format("ddd MMM D")
                .toLowerCase()
                .includes(dateSearchTerm.toLowerCase()) ||
              dayjs(event.day)
                .format("dddd MMMM D")
                .toLowerCase()
                .includes(dateSearchTerm.toLowerCase())
          )
          .map((event, index) => {
            const today = dayjs().startOf("day");
            const eventDay = dayjs(event.day).startOf("day");
            const daysToEvent = eventDay.diff(today, "day");

            let daysIndicator = "";
            if (daysToEvent === 0) daysIndicator = "Today";
            else if (daysToEvent === 1) daysIndicator = "Tomorrow";
            else if (daysToEvent > 1) daysIndicator = `In ${daysToEvent} days`;

            return (
              <div
                key={index}
                className="flex flex-col bg-white shadow-md my-0 p-4 rounded-md w-full hover:bg-blue-100 transition-colors border border-gray-300 mb-3"
              >
                <h3 className="text-lg text-blue-500 font-semibold">
                  {dayjs(event.day).format("ddd, MMM D")}
                </h3>
                {daysIndicator && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="material-icons-outlined mr-2">
                      schedule
                    </span>
                    <p>{daysIndicator}</p>
                  </div>
                )}
                <h2 className="text-2xl text-blue-700 font-bold truncate">
                  {event.title}
                </h2>
                <p className="text-gray-700 truncate">{event.description}</p>
                <p className="text-sm text-blue-700 mt-2">
                  Organized by: {event.userName}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
