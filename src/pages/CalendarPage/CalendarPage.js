// import './CalendarPage.css'
import { useState } from 'react'
import { getMonth } from '../../util'
import CalendarHeader from '../../components/Calendar/CalendarHeader'
import Month from '../../components/Calendar/Month'
import CalendarSidebar from '../../components/Calendar/CalendarSidebar';

function CalendarPage(){
    const [currentMonth, setCurrentMonth] = useState(getMonth())
    return(
        <>
            <div className="h-screen flex flex-columns">
                <CalendarHeader />
                <div className="flex flex-1"> 
                    <CalendarSidebar />
                    <Month month={currentMonth}/>
                </div>
            </div>
        </>
    );
};

export default CalendarPage;

// const today = new Date();
//     const [date, setDate] = useState(today);
//            //the Date object has
//            //getDate() to get the day of the month
//            //getMonth() to get month of year from 0-11, 0=January, 11=December
//            //getFullYear() to get year in 4 digit format
//     return(
//         <>
//            <h1 className="title">CalendarPage</h1>
//            <div className="calendar">
//                 <Calendar
//                     view="month"
//                     showNeighboringMonth={false}
//                     onChange={setDate}
//                     value={date}
//                 />
//            </div>
//            <p className="select-date">{date.toDateString()}</p>
//         </>
//     )