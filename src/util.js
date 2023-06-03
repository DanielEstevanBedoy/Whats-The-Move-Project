// // some shared functions
// import dayjs from "dayjs";

// // returns array that contains the days of the week for each day of the month
// export function getMonth(month = dayjs().month()) {
//   // default = current
//   const year = dayjs().year();
//   // the day of the week of the first day of the month

//   // firstDay = Thurs (4)
//   const firstDay = dayjs(new Date(year, month, 1)).day();

//   // -4
//   let currentDay = -firstDay;

//   // 5 x 7 array
//   const daysMatrix = new Array(5).fill([]).map(() => {
//     return new Array(7).fill(null).map(() => {
//       // -3
//       currentDay++;
//       // 2023, June, -3
//       return dayjs(new Date(year, month, currentDay));
//     });
//   });
//   return daysMatrix;
// }

import dayjs from "dayjs";

export function getMonth(monthIndex = dayjs().month()) {
  const currentYear = dayjs().year();
  
  const startOfMonth = dayjs(new Date(currentYear, monthIndex, 1));
  const startOfWeek = startOfMonth.startOf('week');

  let currentDay = startOfWeek;
  let daysMatrix = [];
  let week = [];

  for(let row=0; row<6; row++){
    for(let col=0; col<7; col++){
      week.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }
    daysMatrix.push(week);
    week = [];
    
    if(currentDay.month() > monthIndex) break;
  }

  return daysMatrix;
}