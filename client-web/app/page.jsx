'use client';

import InputField from "./components/inputField/inputField.jsx";
import RedirectButton from "./components/redirectButton/redirectButton.jsx";

function post() {
    console.log("Pressed");
}

export default function Page() {
    return (
        <>
            <div className="pageContainer">
                <RedirectButton text="Sign In" link="/signin"/>
                <RedirectButton text="Sign Up" link="/signup"/>
            </div>
        </>
    );
}