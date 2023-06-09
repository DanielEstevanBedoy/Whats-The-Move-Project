import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../../Context/GlobalContext";
import dayjs from "dayjs";
import { auth, db } from "../../utils/firebase";
import { ref, set, get, onValue, update } from "firebase/database";

export default function PastEvents() {
  const { friendsEvents, closeFriendEvents } = useContext(GlobalContext);
  const [sortedEvents, setSortedEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateSearchTerm, setDateSearchTerm] = useState("");

  const day = dayjs();

  useEffect(() => {
    const fetchData = async () => {
      const fetch = async () => {
        try {
          const userEventsRef = ref(db, `Users/${auth.currentUser.uid}/Events`);
          const snapshot = await get(userEventsRef);
          const data = snapshot.val();
          const parsedEvents = data ? Object.values(data) : [];
          const allEvents = parsedEvents
            .map((event, index) => ({
              ...event,
              id: index,
            }))
            .concat(friendsEvents)
            .concat(closeFriendEvents);
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
  }, [
    day.format("YYYYMMDD"),
    friendsEvents,
    closeFriendEvents,
    auth.currentUser,
  ]);

  function compareGT(a, b) {
    if (a.day < b.day) return 1;
    if (a.day > b.day) return -1;
    return 0;
  }

  function compareLT(a, b) {
    return -compareGT(a, b);
  }

  useEffect(() => {
    const events = savedEvents.filter(
      (event) => dayjs(event.day).format("YYYYMMDD") < day.format("YYYYMMDD")
    );
    events.sort(compareGT);
    setSortedEvents(events);
  }, [day.format("YYYYMMDD"), auth.currentUser, savedEvents]);

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    if (b64Data) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
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

  return (
    <div className="flex justify-center h-screen bg-white mb-4">
      <div className="flex flex-col items-center h-full w-1/2 overflow-y-scroll pr-0">
        <h1 className="text-4xl text-blue-500 my-8">Past Events</h1>
        <div className="flex justify-between mb-6 w-full">
          <div className="relative rounded-md shadow-sm mb-6 w-1/2 mr-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="material-icons-outlined text-gray-400">
                search
              </span>
            </span>
            <input
              type="text"
              placeholder="Search by user name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full pr-12 sm:text-sm rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="relative rounded-md shadow-sm mb-6 w-1/2 ml-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="material-icons-outlined text-gray-400">
                event
              </span>
            </span>
            <input
              type="text"
              placeholder="Search by date (e.g., MM-DD-YYYY)"
              value={dateSearchTerm}
              onChange={(e) => setDateSearchTerm(e.target.value)}
              className="pl-10 block w-full pr-12 sm:text-sm rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        {sortedEvents
          .filter((event) =>
            event.userName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .filter(
            (event) =>
              dayjs(event.day).format("MM-DD-YYYY").includes(dateSearchTerm) ||
              dayjs(event.day)
                .format("MMMM YYYY")
                .toLowerCase()
                .includes(dateSearchTerm.toLowerCase()) ||
              dayjs(event.day)
                .format("MMM YYYY")
                .toLowerCase()
                .includes(dateSearchTerm.toLowerCase())
          )
          .map((event, index) => (
            <div
              key={index}
              className="flex flex-col bg-white shadow-md my-0 p-4 rounded-md w-full hover:bg-blue-100 transition-colors border border-gray-300 mb-3"
            >
              <h3 className="text-lg text-blue-500 font-semibold">
                {dayjs(event.day).format("MM-DD-YYYY")}
              </h3>
              <h2 className="text-2xl text-blue-700 font-bold truncate">
                {event.title}
              </h2>
              <p className="text-gray-700 truncate">{event.description}</p>
              <p className="text-sm text-blue-700 mt-2">
                Organized by: {event.userName}
              </p>
              {event.image &&
                event.image.map((image, i) => (
                  <div key={i}>
                    <img
                      src={URL.createObjectURL(b64toBlob(image, "image/jpeg"))}
                      alt=""
                      className="w-6/12 mb-2"
                    />
                  </div>
                ))}
              <ImageUploadButton userID={event.userID} eventID={event.id} />
            </div>
          ))}
      </div>
    </div>
  );
}

function ImageUploadButton({ userID, eventID }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"]; // Specify the allowed image file types

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      setFile(null);
      alert("Please select a valid image file (JPEG or PNG).");
    }
  };

  const handleImageUpload = async () => {
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1];
        console.log("eventID: ", eventID);
        const dbRef = ref(db, `Users/${userID}/Events/${eventID}/image`);
        try {
          const snapshot = await get(dbRef);
          const images = snapshot.val() ? Object.values(snapshot.val()) : [];
          images.push(base64String);
          await set(dbRef, images);
          console.log("Image uploaded successfully!");
          setIsUploading(false);
          window.location.reload(true);
        } catch (error) {
          setIsUploading(false);
          console.log("Error adding attribute: ", error);
        }
      };
    } else {
      alert("Please upload an image file");
    }
  };

  return (
    <div>
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-500 transition-colors hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {!file ? "Choose Image" : "Chosen: " + file.name}
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={handleImageUpload}
        disabled={isUploading}
        className={`bg-white-500 hover:text-blue-500 text-black py-2 px-4 transition-colors rounded ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {!isUploading ? "Upload Image" : "Upload in Process"}
      </button>
    </div>
  );
}
