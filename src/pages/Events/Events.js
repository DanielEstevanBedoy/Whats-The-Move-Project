// <<<<<<< alex_choi_upcoming_events
// // import React, { useEffect, useState } from 'react';
// // // import { auth, db } from '../../utils/firebase'; // Update the path to your Firebase configuration file
// // // import { ref, push, set, onValue } from 'firebase/database';
// // import PastEvents from './PastEvents';
// // import FutureEvents from './UpcomingEvents';
// // import { Route, Routes, Link } from 'react-router-dom';
// =======
// import React, { useEffect, useState } from 'react';
// import { auth, db } from '../../utils/firebase'; // Update the path to your Firebase configuration file
// import { ref, push, set, onValue } from 'firebase/database';
// //import { BrowserRouter } from 'react-router-dom';

// import PastEvents from "./PastEvents";
// import FutureEvents from "./UpcomingEvents";
// import {useAuthState} from 'react-firebase-hooks/auth';
// import { BrowserRouter, Route, Routes, Link, useNavigate } from 'react-router-dom';


// >>>>>>> master


// // function Events() {
// //   // const [events, setEvents] = useState([]);
// //   // const [eventName, setEventName] = useState('');
// //   // const [eventDate, setEventDate] = useState('');
// //   // const [eventTime, setEventTime] = useState('');
// //   // const currentUser = auth.currentUser;

// //   // useEffect(() => {
// //   //   if (currentUser) {
// //   //     const eventsRef = ref(db, `Users/${currentUser.uid}/Events`);
// //   //     onValue(eventsRef, (snapshot) => {
// //   //       const eventsData = snapshot.val();
// //   //       if (eventsData) {
// //   //         const eventsList = Object.entries(eventsData).map(([id, event]) => ({
// //   //           id,
// //   //           ...event
// //   //         }));
// //   //         setEvents(eventsList);
// //   //       }
// //   //     });
// //   //   }
// //   // }, [currentUser]);

// //   // const handleCreateEvent = () => {
// //   //   if (eventName && eventDate && eventTime) {
// //   //     const eventId = push(ref(db, `Users/${currentUser.uid}/Events`)).key;
  
// //   //     const eventData = {
// //   //       name: eventName,
// //   //       date: eventDate,
// //   //       time: eventTime,
// //   //       userId: currentUser.uid
// //   //     };
  
// //   //     set(ref(db, `Users/${currentUser.uid}/Events/${eventId}`), eventData)
// //   //       .then(() => {
// //   //         console.log('Event created successfully!');
// //   //         setEventName('');
// //   //         setEventDate('');
// //   //         setEventTime('');
// //   //       })
// //   //       .catch((error) => {
// //   //         console.error('Error creating event:', error);
// //   //       });
// //   //   } else {
// //   //     console.log('Please enter all event details');
// //   //   }
// //   // };
  
// <<<<<<< alex_choi_upcoming_events
// //   return (
// //     <div>
// // 	<h2>Events page</h2>
// // 	<div>
// //             <nav className="navbar">
// //                 <Link to="/PastEvents" className="nav-link"><button className="nav-button">Past Events</button></Link>
// // 	        <Link to="/FutureEvents" className="nav-link"><button className="nav-button">Upcoming Events</button></Link>
// //             </nav>
// //             <Routes>
// //                 <Route path="/PastEvents" element={<PastEvents/>} />
// // 	        <Route path="/FutureEvents" element={<FutureEvents/>} />
// //             </Routes>  
// //         </div>
// //     </div>
// //   );
// // }
// =======
//   return (
//     <div>
// 	<h2>Events page</h2>
// 	<div>
                

  
//         </div>
        
//     </div>
//   );
// }
// >>>>>>> master

// // export default Events;
