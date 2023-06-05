import React, { useContext, useEffect,  useState } from "react";
import GlobalContext from "../../Context/GlobalContext";
import dayjs from "dayjs";
import { auth, db } from "../../utils/firebase";
import { ref, set, get, onValue, update } from "firebase/database";

export default function Events({ lookForward }) {
    const [sortedEvents, setSortedEvents] = useState([]);
    const [savedEvents, setSavedEvents] = useState([]);
    const day = dayjs();


    useEffect(() => {
	const fetchData = async() => {
	    const fetch = async () => {
		try {
		    const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
		    const snapshot = await get(userEventsRef);

		    const data = snapshot.val();
		    const parsedEvents = data ? Object.values(data) : [];
		    parsedEvents.map((event, index) => (
			{...event, id: (index - 1)}
		    ));
		    return parsedEvents;
		} catch (error) {
		    console.log("Error fetching user events:", error);
		}
	    };
	    if (auth.currentUser) {
		const parsedEvents = await fetch();
		setSavedEvents(parsedEvents);
	    }
	};
	fetchData();
    }, [day.format("YYYYMMDD")]);
    
    useEffect(() => {
	const events = savedEvents.filter((event) =>
	    ((!lookForward) ?
	     (dayjs(event.day).format("YYYYMMDD") < day.format("YYYYMMDD"))
	     :
	     (dayjs(event.day).format("YYYYMMDD") >= day.format("YYYYMMDD"))
	));
	events.sort(((lookForward) ? compareLT : compareGT));
	setSortedEvents(events);
    }, [day.format("YYYYMMDD"), auth.currentUser, savedEvents]);
    
    const [file, setFile] = useState(null);
    
    function handleChange(e) {
        setFile(e.target.files[0]);
    }

    const handleImageUpload = async (id) => {
	if (file) {
	    const reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onloadend = async () => {
		const base64String = reader.result.split(',')[1];
		const dbRef = ref(db, `Users/${auth.currentUser.uid}/Events/${id}`);
		try {
		    await update(dbRef, { image: base64String });
		    console.log('Image uploaded successfully!');
		} catch(error) {
		    console.log("Error adding attribute: ", error);
		}
	    };
	}
    };

    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
	const byteCharacters = atob(b64Data);
	const byteArrays = [];
	
	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	    const slice = byteCharacters.slice(offset, offset + sliceSize);
	    
	    const byteNumbers = new Array(slice.length);
	    for (let i = 0; i < slice.length; i++) {
		byteNumbers[i] = slice.charCodeAt(i);
	    }
	    
	    const byteArray = new Uint8Array(byteNumbers);
	    byteArrays.push(byteArray);
	}
	    
	const blob = new Blob(byteArrays, { type: contentType });
	return blob;
    };
	
	
    
    
    return (
	<>
	    <h1 className="flex flex-col items-center"> {(!lookForward) ? "Past Events": "Upcoming Events"} </h1>
	    {sortedEvents.map((event, index) => (
	    <div key={index}>
		{event.title} {dayjs(event.day).format("MM-DD-YYYY")}
		{(!lookForward) ?
		<div>
		    <input type="file" onChange={handleChange} />
		    <button onClick={() => handleImageUpload(event.id)}>Upload Image</button>
		</div>
		 :null}
		{ (!lookForward) ? ((event.image) ? <img src={URL.createObjectURL(b64toBlob(event.image, 'image/jpeg'))} alt=""className="w-3/12"  /> :null) : null }
	    </div>
	    ))}
	</>
    );
}



function compareGT( a, b )
{
    if (a.day < b.day)
	return 1;
    if (a.day > b.day)
	return -1;
    return 0;
}

function compareLT( a, b )
{
    return -(compareGT(a, b));
}


