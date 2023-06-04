import React, { useState, useContext } from "react";
import GlobalContext from "../../Context/GlobalContext";

const labels = ["gray", "blue", "indigo", "green", "red", "purple"];

const colorMap500 = {
  gray: "bg-gray-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  green: "bg-green-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
};

export default function EventForm() {
  const { setShowEventForm, daySelected, dispatchEvent, selectedEvent } =
    useContext(GlobalContext);

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labels.find((lbl) => lbl === selectedEvent.label)
      : labels[0]
  );

  const dayOfTheWeek = daySelected.format("d");

  let formPositionClasses = "";

  switch (dayOfTheWeek) {
    case "0":
      formPositionClasses = "justify-start left-29.5";
      break;
    case "1":
      formPositionClasses = "justify-start left-41.3";
      break;
    case "2":
      formPositionClasses = "justify-start left-53";
      break;
    case "3":
      formPositionClasses = "justify-start left-64.8";
      break;
    case "4":
      formPositionClasses = "justify-end right-35.2";
      break;
    case "5":
      formPositionClasses = "justify-end right-23.5";
      break;
    case "6":
      formPositionClasses = "justify-end right-11.7";
      break;
    default:
      throw new Error();
  }

  function handleSubmit(event) {
    event.preventDefault(); // disable page reload
    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      day: daySelected.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
    };

    if (selectedEvent)
      dispatchEvent({ type: "UPDATE_EVENT", payload: calendarEvent });
    else dispatchEvent({ type: "ADD_EVENT", payload: calendarEvent });
    setShowEventForm(false);
  }

  return (
    <div
      className={
        "h-screen w-full fixed top-0 flex items-center " + formPositionClasses
      }
    >
      <form className="bg-white rounded-lg shadow-2x w-1/4">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent && (
              <span
                onClick={() => {
                  dispatchEvent({
                    type: "REMOVE_EVENT",
                    eventData: selectedEvent,
                  });
                  setShowEventForm(false);
                }}
                className="material-icons-outlined text-gray-400 cursor-pointer"
              >
                delete
              </span>
            )}
            <button onClick={() => setShowEventForm(false)}>
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-1/5 items-end gap-y-7">
            <div></div>
            <input
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              required
              className="pt-3 border-0 text-gray-600 txt-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(event) => setTitle(event.target.value)}
            />
            <span className="material-icons-outlined text-gray-400">
              schedule
            </span>
            {/* We want this to default to currentDay  */}
            <p>{daySelected.format("dddd, MMMM DD")}</p>
            <span className="material-icons-outlined text-gray-400">
              segment
            </span>
            <input
              type="text"
              name="description"
              placeholder="Add description"
              value={description}
              required
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(event) => setDescription(event.target.value)}
            />
            <span className="material-icons-outlined text-gray-400">
              group
            </span>
            <div className="flex gap-x-2">
              {labels.map((lbl, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedLabel(lbl)}
                  className={
                    colorMap500[lbl] +
                    " w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                  }
                >
                  {selectedLabel === lbl && (
                    <span className="material-icons-outlined text-white text-sm">
                      check
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex justify-end border-t p-3 mt-5">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
            onClick={handleSubmit}
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
