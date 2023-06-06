import CalendarPage from "../pages/CalendarPage/CalendarPage";
import Friends from "../pages/Friend/FriendsPage";
import PastEvents from "../pages/Events/PastEvents";
import FutureEvents from "../pages/Events/UpcomingEvents";
import Events from "../pages/Events/Events";
import FriendNotifications from "../pages/Friend/FriendNotifications";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import "./dashboard.css";
import Login from "../pages/Login/login";
import { useState } from "react";
import Notification from "../pages/Events/notification";

function AuthWrapper({ children }) {
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (!user) {
    navigate("/login");
    return null;
  }
  return children;
}

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);

  const handleDropdownClick = () => setDropdownOpen(!dropdownOpen);
  const handleEventsDropdownClick = () =>
    setEventsDropdownOpen(!eventsDropdownOpen);
  const closeEventsDropdown = () => setEventsDropdownOpen(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Notification/>
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <Link
              to="/CalendarPage"
              className="text-gray-700 hover:text-blue-500 transition duration-150"
            >
              Calendar
            </Link>
            <Link
              to="/Friends"
              className="text-gray-700 hover:text-blue-500 transition duration-150"
            >
              Friends
            </Link>
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleEventsDropdownClick}
              >
                <span className="text-gray-700">Events</span>
                <span className="material-icons-outlined text-gray-400 cursor-pointer">
                  expand_more
                </span>
              </div>
              {eventsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-10">
                  <Link
                    to="/PastEvents"
                    onClick={closeEventsDropdown}
                    className="block text-left px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-150"
                  >
                    Past Events
                  </Link>
                  <Link
                    to="/FutureEvents"
                    onClick={closeEventsDropdown}
                    className="block text-left px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-150"
                  >
                    Future Events
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={handleDropdownClick}
            >
              <span className="text-gray-700">{user.displayName}</span>
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-10 h-10 rounded-full"
              />
              <span className="material-icons-outlined text-gray-400 cursor-pointer">
                expand_more
              </span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-10">
                <button
                  onClick={() => auth.signOut()}
                  className="flex justify-between items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-150"
                >
                  Sign out
                  <span className="material-icons-outlined text-gray-400 cursor-pointer">
                    logout
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
        <Routes>
          <Route path="/CalendarPage" element={<CalendarPage />} />
          <Route path="/Friends" element={<Friends />} />
	  <Route path="/Events/*" element={<Events/>} />
          <Route path="/PastEvents/*" element={<PastEvents/>} />
	  <Route path="/FutureEvents/*" element={<FutureEvents/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
