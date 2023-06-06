import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { ref, set, get } from "firebase/database";
import './SignInPage.css';
import logo from '../../assets/logo.png';
import image from '../../assets/GoogleLogo.png';

export default function Login() {
  const googleProvider = new GoogleAuthProvider();

  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // Store user profile in the database
      const userProfileRef = ref(db, `Users/${user.uid}`);
      const userData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };
  
      // Check if user profile already exists
      const snapshot = await get(userProfileRef);
  
      if (!snapshot.exists()) {
        await set(userProfileRef, userData);
        console.log("User profile created:", userData);
      } else {
        console.log("User already has a profile");
      }
  
      console.log("user.photoURL: " + user.photoURL);
  
    } catch (error) {
      console.log(error);
    }
  };
  

 /* return (
    <div className="shadow-xl mt-32 p-10 text-gray 700 rounded-lg">
      <h2 className="text-3xl font-medium">Join Today</h2>

      <div className="py-4">
        <h3 className="py-4">Sign in</h3>
      </div>

      <div className="flex flex-col gap-4">
        <button onClick={GoogleLogin}>Sign in with Google</button>
      </div>
    </div>
  ); }*/

    return(
        <div className="cover">

<h1 className="text-2xl font-large">You have not signed in yet!</h1>
        <div className="container">
        <img src={logo} alt="logo" />
        </div>

        <div> </div>

<h2 className="text-3xl font-medium">Welcome to WhatsTheMove!</h2>
<div> 
    
</div >
<div className="py-4">
<h3 className="text-xl font-medium"> A web app where friends can checkout each other's calendar for events!</h3>
</div>

            <h2 className="text-2xl font-medium">Join WhatsTheMove with Google Now!!</h2>
            <div className="py-4">
            <div className="container">
        
        <img src={image} alt="image" width={80} height={80} />
        </div>

                </div>
            <div className="flex flex-col gap-4">
                <button className="text-white bg-blue-500 p-4 w-full font-medium rounded-lg flex align-midle gap-2">
            
            <button onClick={GoogleLogin} >Sign in with Google</button>
                </button>

            </div>

            <div className="flex flex-col gap-4">
           
            </div>

        </div>

    );
}





