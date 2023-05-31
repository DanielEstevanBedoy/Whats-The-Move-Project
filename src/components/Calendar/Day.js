import React, { useContext } from "react";
import dayjs from "dayjs";
import GlobalContext from "../../Context/GlobalContext";

// Represent every individual item in our grid
export default function Day({ day, rowIndex}) {
  const isToday = dayjs().isSame(dayjs(day), "day");

  const { setDaySelected, setShowEventForm } = useContext(GlobalContext);


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
      ></div>
    </div>
  );
}