import React from "react";
import Events from "./Planning.js";
import PastEvents from "./PastEvents.js"
import { Route, Routes, Link } from 'react-router-dom';

export default function FutureEvents()
{
    return (
	<>
	    <div>
		<nav className="navbar">
	            <Link to="/PastEvents" className="nav-link"><button className="nav-button">Past Events</button></Link>
		</nav>
		<Routes>
	            <Route path="/PastEvents" element={<PastEvents/>} />
		</Routes>  
            </div>
	    <Events lookForward={true} />
	</>
    );
}
