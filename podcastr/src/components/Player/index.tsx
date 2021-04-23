import { useContext, useRef, useEffect } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { PlayerContext } from '../../contexts/PlayerContext';

import styles from './style.module.scss';
import 'rc-slider/assets/index.css';

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const {
        episodeList,
        currentEpisode,
        isPlaying,
        togglePlay,
        setPlayingState,
    } = useContext(PlayerContext);
    const episode = episodeList[currentEpisode];

    useEffect(() => {
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/svg/playing.svg" alt="Ícone de um Fone de Ouvido"/>
                <strong>Tocando Agora {episode?.title}</strong>
            </header>

            {
                episode ? (
                    <div className={styles.currentEpisode}>
                        <Image
                            width={592}
                            height={592}
                            src={episode.thumbnail}
                            objectFit="cover"
                        />
                        <strong>{episode.title}</strong>
                        <p>{episode.members}</p>
                    </div>
                ) : (
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                )
            }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {
                            episode ? (
                                <Slider
                                    trackStyle={{ backgroundColor: '#03d641' }}
                                    railStyle={{ backgroundColor: '#9F75FF' }}
                                    handleStyle={{ borderColor: '#03d641', borderWidth: 4 }}
                                />
                            ) : (
                                <div className={styles.emptySlider} />
                            )
                        }
                    </div>
                    <span>00:00</span>
                </div>

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/svg/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/svg/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button onClick={togglePlay} type="button" className={styles.playBtn} disabled={!episode}>
                        {
                            isPlaying ? <img src="/svg/pause.svg" alt="Pausar"/>
                            : <img src="/svg/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/svg/play-next.svg" alt="Tocar o próximo podcast"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/svg/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>

            {
                episode && (
                    <audio
                        src={episode.url}
                        autoPlay
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                )
            }
        </div>
    );
}