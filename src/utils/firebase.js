// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getDatabase } from "firebase/database";
import {GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATKiQLL8jJSjQedTd4bFso8ughyRhtmu0",
  authDomain: "fir-auth-databa.firebaseapp.com",
  projectId: "fir-auth-databa",
  storageBucket: "fir-auth-databa.appspot.com",
  messagingSenderId: "663279078989",
  appId: "1:663279078989:web:fdcda61d6d20f304839604"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getDatabase(app); // initialize and export the database
