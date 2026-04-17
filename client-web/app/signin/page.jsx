'use client';

import { useState } from "react";
import AuthButton from "../components/authButton/authButton.jsx";
import InputField from "../components/inputField/inputField.jsx";
import RedirectButton from "../components/redirectButton/redirectButton.jsx";

function post() {
    console.log("Pressed");
}

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [info, setInfo] = useState('');

    const serverAddr = "http://127.0.0.1:3030";

    async function sendRequest() {
        try {
            const path = "/api/signin";
        
            let reqData = {};
            reqData["password"] = password;
            reqData["email"] = email;
            
            const response = await fetch(serverAddr + path, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(reqData)
            });
            
            const resData = await response.json();
            if (!response.ok) {
                console.log(`Error: ${resData["error"]}`);
                setInfo("Проверьте почту или пароль")
                return;
            }

            setInfo("Вход произведен успешно!");
        } catch (err) {
            console.error(err);
        }
    }

    async function handleAuthClick() {
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        if (email.length <= 5 || password.length <= 5) {
            setInfo("Длина пароля или почты меньше 5 символов")
            return;
        }
        await sendRequest();
    }

    return (
        <>
            <RedirectButton text="На главную" link="/"/>
            <div className="pageContainer">
                <div className="text">Почта:</div>
                <InputField text="email" value={email} onChange={(e) => setEmail(e.target.value)}></InputField>
                <div className="text">Пароль:</div>
                <InputField text="password" value={password} onChange={(e) => setPassword(e.target.value)}></InputField>
                <AuthButton text="Войти" handleClick={handleAuthClick}/>
                <div className="errorText">{info}</div>
            </div>
        </>
    );
}