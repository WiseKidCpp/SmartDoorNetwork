'use client'

import Link from "next/link";
import styles from "./authButton.module.css";

export default function AuthButton({ text, type, handleClick }) {
    return (
        <>
            <button onClick={handleClick} className={styles.authButton}>
                {text}
            </button>
        </>
    );
}