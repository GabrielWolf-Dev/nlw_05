import { useState } from 'react';

import Header from '../components/Header';
import Player from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';

import '../styles/globalStyle.scss';
import styles from  '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisode(0);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  return(
    <PlayerContext.Provider value={{ episodeList, currentEpisode, play, togglePlay, isPlaying, setPlayingState }}>
      <section className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </section>
    </PlayerContext.Provider>
  );
}

export default MyApp
