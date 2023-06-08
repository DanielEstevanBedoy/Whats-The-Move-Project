import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { ref, set, get } from "firebase/database";
import "./SignInPage.css";
import logo from "../../assets/message-icon.png";
import image from "../../assets/GoogleLogo.png";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src={logo} alt="logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-500">
            WHATSTHEMOVE?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Changing the world...
          </p>
        </div>
        <button
          onClick={GoogleLogin}
          className="mt-5 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <img src={image} alt="Google Logo" className="h-5 w-5" />
          </span>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
