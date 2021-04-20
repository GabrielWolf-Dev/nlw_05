import styles from './style.module.scss';

export default function Header() {
    const currentDate = new Date().toLocaleDateString('BRL', {
        day: 'numeric',
        weekday: 'short',
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
