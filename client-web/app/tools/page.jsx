'use client';

import { useState } from "react";
import AuthButton from "../components/authButton/authButton.jsx";
import InputField from "../components/inputField/inputField.jsx";
import RedirectButton from "../components/redirectButton/redirectButton.jsx";
import Header from "../components/header/header.jsx";
import LogoutButton from "../components/logoutButton/logoutButton.jsx";
import Cookies from 'js-cookie';

function post() {
    console.log("Pressed");
}

export default function Page() {
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [info, setInfo] = useState('');

    const serverAddr = "http://127.0.0.1:3030";

    async function sendRequest() {
        try {
            const path = "/api/newtenant";
        
            let reqData = {};
            reqData["email"] = email;
            reqData["id"] = id;
            console.log(Cookies.get('access-token'));
            const response = await fetch(serverAddr + path, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('access-token')}`
                },
                body: JSON.stringify(reqData)
            });
            
            const resData = await response.json();
            if (!response.ok) {
                console.log(`Error: ${resData["error"]}`);
                setInfo("Проверьте корректность введенных данных");
                return;
            }

            setInfo("Доступ выдан успешно!");
        } catch (err) {
            console.error(err);
        }
    }

    async function handleClick() {
        console.log(`Email: ${email}`);
        if (email.length < 5) {
            setInfo("Длина почты меньше 5 символов")
            return;
        }
        await sendRequest();
    }

    return (
        <>
            <Header text="Выдача аренды"/>
            <LogoutButton/>
            <div className="pageContainer">
                <div className="text">Email пользователя</div>
                <InputField text="email" value={email} onChange={(e) => setEmail(e.target.value)} type="text"></InputField>
                <div className="text">Id жилья</div>
                <InputField text="id" value={id} onChange={(e) => setId(e.target.value)} type="text"></InputField>
                <AuthButton text="Добавить" handleClick={handleClick}/>
                <div className="errorText">{info}</div>
            </div>
        </>
    );
}