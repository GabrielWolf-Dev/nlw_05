import styles from './style.module.scss';

export default function Header() {
    const currentDate = new Date().toLocaleDateString('BRL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return(
        <header className={styles.headerContainer}>
            <img src="/svg/logo.svg" alt="Logo da aplicação" />

            <p className={styles.phaseHeader}>O melhor para você ouvir, sempre</p>

            <p>{currentDate}</p>
        </header>
    );
}
