import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase, ref } from "firebase/database";

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
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getDatabase(app); // initialize and export the database
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const databaseRef = ref(db);

export { auth, db, databaseRef };
export default app;