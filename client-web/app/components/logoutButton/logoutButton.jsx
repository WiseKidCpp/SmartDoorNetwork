'use client'

import Link from "next/link";
import styles from "./logoutButton.module.css";
import Cookies from 'js-cookie';

export default function LogoutButton() {
    function handleClick() {
        Cookies.set('access-token', '');
        Cookies.set('refresh-token', '');
        window.location.href = '/';
    }
    return (
        <>
            <button onClick={handleClick} className={styles.redirectButton}>Выйти</button>
        </>
    );
}