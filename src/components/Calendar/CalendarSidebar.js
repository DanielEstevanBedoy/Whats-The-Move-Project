import CreateEventButton from "./CreateEventButton.js";
import React, { useContext } from "react";
import GlobalContext from "../../Context/GlobalContext";

export default function CalendarSidebar() {
  const { showFriendsEvents, setShowFriendsEvents, showCloseFriendEvents, setShowCloseFriendEvents } = useContext(GlobalContext);

  const handleFriendToggleChange = (event) => {
    setShowFriendsEvents(event.target.checked);
  };
  const handleCloseFriendToggleChange = (event) => {
    setShowCloseFriendEvents(event.target.checked);
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
            onChange={handleFriendToggleChange}
          />
          <span className="ml-2">Friends</span>
        </label>
        <label htmlFor="show-close-friends-events" className="flex items-center">   {/* new label */}
          <input
            type="checkbox"
            id="show-close-friends-events"
            checked={showCloseFriendEvents}
            onChange={handleCloseFriendToggleChange}
          />
          <span className="ml-2">Close Friends</span>
        </label>
      </div>
    </aside>
  );
}
