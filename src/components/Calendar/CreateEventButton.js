import React, { useContext } from "react";
import GlobalContext from "../../Context/GlobalContext";

export default function CreateEventButton() {
  const { setShowEventForm } = useContext(GlobalContext);
  return (
    <button
      onClick={() => setShowEventForm(true)}
      className="border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl"
    >
      Create
    </button>
  );
}
