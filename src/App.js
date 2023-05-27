import React, { Component } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar/SideBar';
import './App.css';

import Layout from '../src/components/Layout'
import HomePage from './pages/HomePage/HomePage.js';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import FollowingPage from './pages/FollowingPage/FollowingPage';
import Login from './pages/Login/login';

import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from "../src/utils/firebase"
import Dashboard from './components/dashboard';
//import {}// 
//import { getMonth } from './util'

function App() {
  // console.table(getMonth(5))
  const [user, loading] = useAuthState(auth);


  return (
    <div>
   
<div>
    {!user&&(
      <div>
      <h1> You have not signed in</h1>
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
