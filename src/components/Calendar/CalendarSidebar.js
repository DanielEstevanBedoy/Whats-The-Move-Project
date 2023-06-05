import React from "react";
import CreateEventButton from "./CreateEventButton.js";

export default function CalendarSidebar() {
  return (
    <aside className="border p-5 w-64">
      <CreateEventButton />
    </aside>
  );
}
