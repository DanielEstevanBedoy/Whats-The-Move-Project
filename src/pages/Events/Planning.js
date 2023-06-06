
// import React, { useContext, useEffect,  useState } from "react";
// import GlobalContext from "../../Context/GlobalContext";
// import dayjs from "dayjs";
// import { storage } from "../../utils/firebase";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// export default function Events({ lookForward }) {
//     const [pastEvents, setPastEvents] = useState([]);
//     const {savedEvents} = useContext(GlobalContext);
//     const day = dayjs();
    
//     useEffect(() => {
// 	const events = savedEvents.filter(
// 	    (event) => ((!lookForward) ? (dayjs(event.day).format("YYYYMMDD") < day.format("YYYYMMDD")) : (dayjs(event.day).format("YYYYMMDD") >= day.format("YYYYMMDD") )
// 		       ));
// 	events.sort(((lookForward) ? compareLT : compareGT));
// 	setPastEvents(events);
//     }, [day.format("YYYYMMDD")]);
    
//     const [file, setFile] = useState("");
//     const [percent, setPercent] = useState(0);

//     function handleChange(event) {
// 	setFile(event.target.files[0]);
//     }

//     const handleUpload = () => {
// 	if (!file) {
// 	    alert("Please upload an image first!");
// 	}
// 	const storageRef = ref(storage, '/files/${file.name}');

// 	const uploadTask = uploadBytesResumable(storageRef, file);

// 	uploadTask.on(
// 	    "state_changed",
// 	    (snapshot) => {
// 		const percent = Math.round(
// 		    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
// 		);

// 		setPercent(percent);
// 	    },
// 	    (err) => console.log(err),
// 	    () => {
// 		getDownloadURL(uploadTask.snapshot.ref).then((url) => {
// 		    console.log(url);
// 		});
// 	    }
// 	);
//     };
    
//     return (
// 	<>
// 	    <h1 className="flex flex-col items-center"> {(!lookForward) ? "Past Events": "Upcoming Events"} </h1>
// 	    {pastEvents.map((event, index) => (
// 	    <div key={index}>
// 		{event.title} {dayjs(event.day).format("MM-DD-YYYY")}
// 		<div>
// 		    <input type="file" onChange={handleChange} accept="/image/*" />
// 		    <button onClick={handleUpload}>Upload to Firebase</button>
// 		    <p>{percent} "% done"</p>
// 		</div>
// 	    </div>
// 	    ))}
// 	</>
	
// 	);
// }

// function compareGT( a, b )
// {
//     if (a.day < b.day)
// 	return 1;
//     if (a.day > b.day)
// 	return -1;
//     return 0;
// }

// function compareLT( a, b )
// {
//     return -(compareGT(a, b));
// }
    
