import { useState } from 'react'
import './FollowingPage.css'
function FollowingPage(){
    return(
    <>
        <h1 className="title">FollowingPage</h1>
        <Following />
    </>
    );
}

function Following() {
    //after having creation of profile system,
    // construct an array of persons using system
    // add/delete any attributes in the function person located below
    //     (function person may be relocated later)
    let a = new person(12, "hey")
    let b = new person(16, "another")
    let c = new person(20, "MORE")
    
    let friends = [a, b, c]
    const list  = friends.map((p, move) => {
        // display format depending on what attributes a person should have in the profile
        // link to profile, for later use
        return (
            <li class="profile" key={move}>
                
                Name: {p.name}  Age: {p.age}
                <a href=""></a>
            </li>
        );
    });
    return (
        <ul class="profileList">
            {list}
        </ul>
    );
}

function person(age, name, Available) {
    this.age=age
    this.name=name
}

                       
export default FollowingPage;
