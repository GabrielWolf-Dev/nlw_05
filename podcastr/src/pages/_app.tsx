import Header from '../components/Header';
import Player from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';

import '../styles/globalStyle.scss';
import styles from  '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  return(
      <PlayerContextProvider>
        <section className={styles.wrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>
          <Player />
        </section>
      </PlayerContextProvider>
  );
}

export default MyApp
