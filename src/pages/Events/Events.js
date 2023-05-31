import React, { useContext, useEffect,  useState } from "react";
import GlobalContext from "../../Context/GlobalContext";
import dayjs from "dayjs";

export default function Events({ lookForward }) {
    const [pastEvents, setPastEvents] = useState([]);
    const {savedEvents} = useContext(GlobalContext);
    const day = dayjs();
    useEffect(() => {
	const events = savedEvents.filter(
	    (event) => ((!lookForward) ? (dayjs(event.day).format("YYYYMMDD") < day.format("YYYYMMDD")) : (dayjs(event.day).format("YYYYMMDD") >= day.format("YYYYMMDD") )
		       ));
	events.sort(((lookForward) ? compareLT : compareGT));
	setPastEvents(events);
    }, [day]);
    

    
    return (
	<>
	    <h1 className="flex flex-col items-center"> {(!lookForward) ? "Past Events": "Upcoming Events"} </h1>
	    {pastEvents.map((event, index) => (
	    <div key={index}>
		{event.title} {dayjs(event.day).format("MM-DD-YYYY")}
	    </div>
	    ))}
	</>
	
	);
}

function compareGT( a, b )
{
    if (a.day < b.day)
	return 1;
    if (a.day > b.day)
	return -1;
    return 0;
}

function compareLT( a, b )
{
    return -(compareGT(a, b));
}
    
