import CreateEventButton from "./CreateEventButton.js";
import React, { useContext } from "react";
import GlobalContext from "../../Context/GlobalContext";

export default function CalendarSidebar() {
  const { showFriendsEvents, setShowFriendsEvents } = useContext(GlobalContext);

  const handleToggleChange = (event) => {
    setShowFriendsEvents(event.target.checked);
  };
  
  return (
    <aside className="border p-5 w-64">
      <CreateEventButton />
      <div className="mt-4">
        <label htmlFor="show-friends-events" className="flex items-center">
          <input
            type="checkbox"
            id="show-friends-events"
            checked={showFriendsEvents}
            onChange={handleToggleChange}
          />
          <span className="ml-2">Show Friends' Events</span>
        </label>
      </div>
    </aside>
  );
}
