'use client'

import styles from './inputField.module.css';

export default function InputField({ text, value, onChange, type }) {
    return (
        <>
            <input type={type} placeholder={text} value={value} onChange={onChange} className={styles.inputField}/>
        </>
    );
}