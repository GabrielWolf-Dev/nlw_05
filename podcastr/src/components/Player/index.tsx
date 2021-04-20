import styles from './style.module.scss';

export default function Player() {
    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/svg/playing.svg" alt="Ícone de um Fone de Ouvido"/>
                <strong>Tocando Agora</strong>
            </header>

            <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
            </div>

            <footer className={styles.empty}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        <div className={styles.emptySlider} />
                    </div>
                    <span>00:00</span>
                </div>

                <div className={styles.buttons}>
                    <button type="button">
                        <img src="/svg/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button">
                        <img src="/svg/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={styles.playBtn}>
                        <img src="/svg/play.svg" alt="Tocar"/>
                    </button>
                    <button type="button">
                        <img src="/svg/play-next.svg" alt="Tocar o próximo podcast"/>
                    </button>
                    <button type="button">
                        <img src="/svg/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}