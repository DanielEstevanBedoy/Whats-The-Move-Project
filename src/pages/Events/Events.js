import React, { useContext, useEffect,  useState } from "react";
import GlobalContext from "../../Context/GlobalContext";
import dayjs from "dayjs";


export default function Test() {
    const [pastEvents, setPastEvents] = useState([]);
    const {savedEvents} = useContext(GlobalContext);
    const day = dayjs();
    useEffect(() => {
	const events = savedEvents.filter(
	    (event) => dayjs(event.day).format("YYYYMMDD") < day.format("YYYYMMDD")
	);
//	events.sort();
	setPastEvents(events);
    }, [day]);
    

    
    return (
	<>
	    <h1 className="flex flex-col items-center"> Events </h1>
	    {pastEvents.map((event, index) => (
	    <div key={index}>
		{event.title}
	    </div>
	    ))}
	</>
	
	);
}

//function compare( a, b )
//{
    
//}
