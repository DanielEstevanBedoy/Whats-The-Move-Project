import React, { useContext } from "react";
import GlobalContext from "../../Context/GlobalContext";
import { BrowserRouter } from "react-router-dom";
import { auth, db } from "../../utils/firebase";
import { ref, set, get } from "firebase/database";


//useOnKeyPress(submitHandler, 'Enter');
 // useOnKeyPress(() => setValue(''), 'Delete');


export default function CreateEventButton() {
  const { setShowEventForm } = useContext(GlobalContext);




  return (
    <button
      onClick={() => setShowEventForm(true)}
      className="border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl"
    >
      Create
    </button>



  );
}

