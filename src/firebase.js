// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUuU7oi6EP22YLpEKzY2NafWSl1E0bB3g",
  authDomain: "whats-the-move-project-bb0b0.firebaseapp.com",
  projectId: "whats-the-move-project-bb0b0",
  storageBucket: "whats-the-move-project-bb0b0.appspot.com",
  messagingSenderId: "660621588489",
  appId: "1:660621588489:web:a6494a114f1ae0fd48e0d8",
  measurementId: "G-PTBTC7H0DJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

