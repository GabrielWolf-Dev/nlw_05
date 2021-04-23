import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { durationToString } from '../../utils/convertDuration';
import { usePlayer } from '../../contexts/PlayerContext';

import styles from './style.module.scss';
import 'rc-slider/assets/index.css';

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisode,
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState,
    } = usePlayer();
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

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleProgress(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEnded(){
        if(hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

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
                    <span>{durationToString(progress)}</span>
                    <div className={styles.slider}>
                        {
                            episode ? (
                                <Slider
                                    max={episode.duration}
                                    value={progress}
                                    onChange={handleProgress}
                                    trackStyle={{ backgroundColor: '#03d641' }}
                                    railStyle={{ backgroundColor: '#9F75FF' }}
                                    handleStyle={{ borderColor: '#03d641', borderWidth: 4 }}
                                />
                            ) : (
                                <div className={styles.emptySlider} />
                            )
                        }
                    </div>
                    <span>{durationToString(episode?.duration ?? 0)}</span>
                </div>

                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/svg/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/svg/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button onClick={togglePlay} type="button" className={styles.playBtn} disabled={!episode}>
                        {
                            isPlaying ? <img src="/svg/pause.svg" alt="Pausar"/>
                            : <img src="/svg/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/svg/play-next.svg" alt="Tocar o próximo podcast"/>
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/svg/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>

            {
                episode && (
                    <audio
                        src={episode.url}
                        autoPlay
                        loop={isLooping}
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onEnded={handleEnded}
                        onLoadedMetadata={setupProgressListener}
                    />
                )
            }
        </div>
    );
}