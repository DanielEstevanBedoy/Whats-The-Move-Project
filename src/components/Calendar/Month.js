import React from "react";
import Day from "./Day";

function Week({ days, weekIndex }) {
  return days.map((day, dayIndex) => (
    <Day key={dayIndex} day={day} rowIndex={weekIndex} />
  ));
}

/* takes one prop, months, which is a two-dimensional array 
representing  a grid of days (of the week)*/

// export default function Month({ month }) {
//   return (
//     <div className="flex-1 grid grid-cols-7 grid-rows-5">
//       {month.map((week, weekIndex) => (
//         <React.Fragment key={weekIndex}>
//           <Week days={week} weekIndex={weekIndex} />
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }

export default function Month({ month }) {
  const numberOfRows = month.length;
  return (
    <div
      className="flex-1 grid grid-cols-7"
      style={{ gridTemplateRows: `repeat(${numberOfRows}, 1fr)` }}
    >
      {month.map((week, weekIndex) => (
        <React.Fragment key={weekIndex}>
          <Week days={week} weekIndex={weekIndex} />
        </React.Fragment>
      ))}
    </div>
  );
}
