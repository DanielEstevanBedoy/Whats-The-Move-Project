import CalendarPage from "../pages/CalendarPage/CalendarPage";
import Friends from "../pages/Friend/FriendsPage";
import PastEvents from "../pages/Events/PastEvents";
import FutureEvents from "../pages/Events/UpcomingEvents";
import Events from "../pages/Events/Events";
import {auth} from "../utils/firebase";
import {useAuthState} from 'react-firebase-hooks/auth';
import { BrowserRouter, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './dashboard.css';
import Login from "../pages/Login/login";

function AuthWrapper({children}){
    const [user,loading] = useAuthState(auth);

const navigate = useNavigate();
if(loading){
    return <h1>Loading...</h1>;
}
if(!user){
    navigate('/login');
    return null;
}
return children;
}






export default function Dashboard(){

    const [user,loading] = useAuthState(auth);


    return(
        <div className="dashboard">
            <div className="header">
                <h2>Dashboard component: You have signed in {user.displayName} </h2>
                <button onClick={()=> auth.signOut()} className="signout-button">Sign out</button>
            </div>
            <BrowserRouter>
                <nav className="navbar">
                    <Link to="/CalendarPage" className="nav-link"><button className="nav-button">CalendarPage</button></Link>
                    <Link to="/Friends" className="nav-link"><button className="nav-button"> Friends</button></Link>
	            <Link to="/Events" className="nav-link"><button className="nav-button"> Events</button></Link>
                </nav>
                <Routes>
                    <Route path="/CalendarPage" element={<CalendarPage />} />
                    <Route path="/Friends" element={<Friends/>} />
	            <Route path="/Events/*" element={<Events/>} />
                    <Route path="/PastEvents/*" element={<PastEvents/>} />
	            <Route path="/FutureEvents/*" element={<FutureEvents/>} />
                    <Route path="/login" element={<Login/>} />
                </Routes>  
            </BrowserRouter>
        </div>
    );
}
