import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from "../../utils/firebase";

export default function Login() {
    const googleProvider = new GoogleAuthProvider();

    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            // Adding user data to the database after successful Google login.
            const database = getDatabase();
            set(ref(database, 'Users/' + user.uid), {
                email: user.email,
                displayName: user.displayName,
                // You can add more fields here according to the user information you need.
            })
            .then(() => {
                console.log('User added to the database successfully!');
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="shadow-xl mt-32 p-10 text-gray 700 rounded-lg">
            <h2 className="text-3xl font-medium">Join Today</h2>

            <div className="py-4">
                <h3 className="py-4">Sign in</h3>
            </div>

            <div className="flex flex-col gap-4">
                <button onClick={GoogleLogin}>Sign in with Google</button>
            </div>
        </div>
    );
}
