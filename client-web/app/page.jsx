'use client';

import { useEffect } from "react";
import Header from "./components/header/header.jsx";
import InputField from "./components/inputField/inputField.jsx";
import RedirectButton from "./components/redirectButton/redirectButton.jsx";
import Cookies from 'js-cookie';


function post() {
    console.log("Pressed");
}

export default function Page() {
    useEffect(() => {
        async function sendRequest() {
            try {
                
                const serverAddr = 'http://127.0.0.1:3030';
                const path = "/api/checktoken";
                    
                const response = await fetch(serverAddr + path, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('access-token')}`
                    },
                    body: '{}'
                });
                    
                if (response.ok) {
                    window.location.href = '/tools';
                    return;
                }   
            } catch (err) {
                console.error(err);
            }
        }

        sendRequest();
    }, []);
    return (
        <>
            <Header text="Главная"/>
            <div className="pageContainer">
                <RedirectButton text="Вход" link="/signin"/>
                <RedirectButton text="Регистрация" link="/signup"/>
            </div>
        </>
    );
}