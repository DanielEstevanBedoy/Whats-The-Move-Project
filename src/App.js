import React, { Component } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//import logo from './assets/logo-color.png';
import './App.css';
import logo from './assets/logo.png';
import  './pages/Login/SignInPage.css';

import Login from './pages/Login/login';

import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from "../src/utils/firebase"
import Dashboard from './components/dashboard';
import CalendarPage from './pages/CalendarPage/CalendarPage';
//import {}// 
//import { getMonth } from './util'

function App() {

  // console.table(getMonth(5))
  const [user, loading] = useAuthState(auth);

  return (
    <div>
   
<div className="background">
    {!user&&(
      <div className="center">
        
        
           

     
          

      <Login/>
      </div>

    )
    }
    </div>
    {user&&(
      <div>
        
        <Dashboard/>



     </div>

    )}


    </div>

/*return(
  <div className="dashboard">
      <div className="header">
          <h2>Dashboard component: You have signed in {user.displayName} </h2>
          <button onClick={()=> auth.signOut()} className="signout-button">Sign out</button>
      </div>
      <BrowserRouter>
          <nav className="navbar">
              <Link to="/CalendarPage" className="nav-link"><button className="nav-button">Calendar</button></Link> 
              <Link to="/Friends" className="nav-link"><button className="nav-button"> Friends</button></Link>
        <Link to="/Events" className="nav-link"><button className="nav-button"> Events</button></Link>
              <Link to="/PastEvents" className="nav-link"><button className="nav-button">Past Events</button></Link>
        <Link to="/FutureEvents" className="nav-link"><button className="nav-button">Upcoming Events</button></Link>
          </nav>
          <Routes>
              <Route path="/CalendarPage" element={<CalendarPage />} />
              <Route path="/Friends" element={<Friends/>} />
        <Route path="/Events" element={<Events/>} />
              <Route path="/PastEvents" element={<PastEvents/>} />
        <Route path="/FutureEvents" element={<FutureEvents/>} />
              <Route path="/login" element={<Login/>} />
          </Routes>  
      </BrowserRouter>
  </div>
);
} */













    // <Layout>
    //   {/* Render your component directly */}
    //   <BrowserRouter>
    //   <Routes>
    //   <Route path="/" element={<HomePage />} />
    //     <Route path="/CalendarPage" element={<CalendarPage />} />
    //     <Route path="/FollowingPage" element={<FollowingPage />} />
    //   </Routes>  
    //    </BrowserRouter>
    //   </Layout>


    // <div className="App">
    //   <BrowserRouter>
    //   {/* {<Sidebar/> } */}
    //   <Routes>
    //     <Route path='/' element={<HomePage/>}></Route>
    //     <Route path='/CalendarPage' element={<CalendarPage/>}></Route>
    //     <Route path='/FollowingPage' element={<FollowingPage/>}></Route>
    //   </Routes>  
    //   </BrowserRouter>
    //</div>
  );
}

export default App;
