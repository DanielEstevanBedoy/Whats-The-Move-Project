import React, { useContext } from "react";
import logo from "../../assets/logo-color.png";
import GlobalContext from "../../Context/GlobalContext";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }
  return (
    <header className="px-4 py-2 flex items-center">
      <img src={logo} alt="logo" className="mr-2 w-12 h-12" />
      <h1 className="mr-10 text-xl text-gray-500">what's the move?</h1>
      <button className="border rounded py-2 px-4 mr-5">Today</button>
      <button onClick={handlePrevMonth()}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_left
        </span>
      </button>
      <button onClick={handleNextMonth()}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_right
        </span>
      </button>
    </header>
  );
}
