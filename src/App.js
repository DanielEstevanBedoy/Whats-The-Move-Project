
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
	    )}
	</div>
	{user&&(
	    <div>
		<Dashboard/>
	    </div>
	)}
    </div>
  );
}

export default App;
