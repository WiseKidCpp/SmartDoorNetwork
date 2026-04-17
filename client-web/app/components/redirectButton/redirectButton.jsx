'use client'

import Link from "next/link";
import styles from "./redirectButton.module.css";

export default function RedirectButton({ text, link }) {
    return (
        <>
            <Link href={link} className={styles.redirectButton}>
                {text}
            </Link>
        </>
    );
}