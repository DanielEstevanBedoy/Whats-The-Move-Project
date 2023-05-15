import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar/SideBar';
import './App.css';

import HomePage from './pages/HomePage/HomePage.js';
import CalendarPage from './pages/CalendarPage/Calendar';
import FollowingPage from './pages/FollowingPage/FollowingPage';
import { Auth } from './pages/SignUpPage/SignUpPage';

function App() {
  return (
    <div className="App">
      <Auth />
      <BrowserRouter>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/CalendarPage' element={<CalendarPage/>}></Route>
        <Route path='/FollowingPage' element={<FollowingPage/>}></Route>
      </Routes>  
      </BrowserRouter>
    </div>
  );
}

export default App;
