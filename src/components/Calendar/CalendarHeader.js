import React, { useContext } from "react";
import logo from "../../assets/logo-color.png";
import GlobalContext from "../../Context/GlobalContext";
import dayjs from "dayjs";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function handleReset() {
    setMonthIndex(dayjs().month());
  }
  return (
    <header className="px-4 py-2 flex items-center">
      <img src={logo} alt="logo" className="mr-2 w-12 h-12" />
      {/* font changed to black from gray-500 */}
      <h1 className="mr-10 text-xl text-black">what's the move?</h1>
      <button className="border rounded py-2 px-4 mr-5" onClick={handleReset}>
        Today
      </button>
      <button onClick={handlePrevMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_left
        </span>
      </button>
      <button onClick={handleNextMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_right
        </span>
      </button>
      {/* formatting is off */}
      <h2 className="ml-4 text-xl text-gray-500 font-bold">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h2>
    </header>
  );
}
