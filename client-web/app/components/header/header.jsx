import styles from "./header.module.css";

export default function Header({ text }) {
    return (
        <>
            <div className={`${styles.topBarMainPage} topBar`} id="top-bar-main-page" >
                <h1>{text}</h1>
            </div>
        </>
    );
}