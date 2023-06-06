import React, { useContext, useEffect,  useState } from "react";
import GlobalContext from "../../Context/GlobalContext";
import dayjs from "dayjs";
import { auth, db } from "../../utils/firebase";
import { ref, set, get, onValue, update } from "firebase/database";

export default function PastEvents() {
    const { friendsEvents } = useContext(GlobalContext);
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
		    parsedEvents.map((event, index) => ({
			...event,
			id: index - 1
		    }))
		    const allEvents = parsedEvents.concat(friendsEvents);
		    return allEvents;
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
    
    useEffect(() => {
	const events = savedEvents.filter((event) =>
	     (dayjs(event.day).format("YYYYMMDD") < day.format("YYYYMMDD"))
	);
	events.sort(compareGT);
	setSortedEvents(events);
    }, [day.format("YYYYMMDD"), auth.currentUser, savedEvents]);
    
    const [file, setFile] = useState(null);
    
    function handleChange(e) {
        setFile(e.target.files[0]);
    }

    const handleImageUpload = async (eventID) => {
	if (file) {
	    const reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onloadend = async () => {
		const base64String = reader.result.split(',')[1];
		const dbRef = ref(db, `Users/${auth.currentUser.uid}/Events/${eventID}/image`);
		try {
		    const snapshot = await get(dbRef);
		    const images = snapshot.val() || [];
		    images.push(base64String);
		    await set(dbRef, images);
		    console.log('Image uploaded successfully!');
		    window.location.reload(true);
		} catch(error) {
		    console.log("Error adding attribute: ", error);
		}
	    };
	}
    };

    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
	if (b64Data) {
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
	}
    };

    /*{event.image ? (
			    event.image.map((image, i) => (
			     <div key={i}>
				 <img
				     src={URL.createObjectURL(b64toBlob(image, "image/jpeg"))}
				     alt=""
				     className="w-6/12"
				 />
			     </div>
			    ))
			    ) : null}
			    */
    
    
    return (
	<div className="flex justify-center h-screen bg-white mb-4">
	    <div className="flex flex-col items-center h-full w-1/2 overflow-y-scroll pr-0">
		<h1 className="text-4xl text-blue-500 my-8">Past Events</h1>
		{sortedEvents
		 .map((event, index) => (
		     <div
			 key={index}
			 className="flex flex-col bg-white shadow-md my-0 p-4 rounded-md w-full hover:bg-blue-100 transition-colors border border-gray-300"
		     >
			 <h3 className="text-lg text-blue-500 font-semibold">
			     {dayjs(event.day).format("ddd, MMM D")}
			 </h3>
			 <h2 className="text-2xl text-blue-700 font-bold truncate">
			     {event.title}
			 </h2>
			 <p className="text-gray-700 truncate">{event.description}</p>
			 <p className="text-sm text-blue-700 mt-2">
			     Hosted by: {event.userName}
			 </p>
			{event.image &&
			 event.image.map((image, i) => (
			     <div key={i}>
				 <img
				     src={URL.createObjectURL(b64toBlob(image, "image/jpeg"))}
				     alt=""
				     className="w-6/12"
				 />
			     </div>
			 ))}
			{(event.userName == auth.currentUser.displayName) ?
			<div>
			    <input type="file" onChange={(e) => handleChange(e)} />
			    <button onClick={() => handleImageUpload(event.id)}>Upload Image</button>
			</div>
			 :null}
			
		    </div>
		 ))}
	    </div>
	</div>
    );
}


function ImageCollection(eventID) {
    
    return (<></>);

}
