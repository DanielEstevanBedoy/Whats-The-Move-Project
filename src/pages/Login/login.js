import{GoogleAuthProvider, signInWithPopup} from  "firebase/auth";
import {auth} from "../../utils/firebase";



export default function Login(){
     const googleProvider = new GoogleAuthProvider();

    const GoogleLogin = async ()=>{
        try{
            const result = await signInWithPopup(auth,googleProvider);
            console.log(result.user);
        }
        catch(error){
            console.log(error);
        }

   }


    return(
        <div className="shadow-xl mt-32 p-10 text-gray 700 rounded-lg">
            <h2 className="text-3xl font-medium">Join Today</h2>

            <div className="py-4">
                <h3 className="py-4">Sign in</h3>

            </div> 

            <div className="flex flex-col gap-4">
            <button onClick={GoogleLogin} >Sign in with google</button>
            </div>

        </div>

    );
}