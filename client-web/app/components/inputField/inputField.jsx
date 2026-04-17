'use client'

import styles from './inputField.module.css';

export default function InputField({ text, value, onChange }) {
    return (
        <>
            <input type="text" placeholder={text} value={value} onChange={onChange} className={styles.inputField}/>
        </>
    );
}