import './CalendarPage.css'
import { useContext, useState, useEffect } from 'react'
import { getMonth } from '../../util'
import CalendarHeader from '../../components/Calendar/CalendarHeader'
import Month from '../../components/Calendar/Month'
import CalendarSidebar from '../../components/Calendar/CalendarSidebar';
import GlobalContext from '../../Context/GlobalContext'

function CalendarPage(){
    const [currentMonth, setCurrentMonth] = useState(getMonth())
    
    /* Accessing the value of GlobalContext */
    const { monthIndex } = useContext(GlobalContext)

    /* The function passed to useEffect will run everytime monthIndex changes*/
    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex]);

    return(
        <>
            <div className="h-screen flex flex-col">
                <CalendarHeader/>
                <div className="flex flex-1"> 
                    <CalendarSidebar/>
                    <Month month={currentMonth}/>
                </div>
            </div>
        </>
    );
};

export default CalendarPage;