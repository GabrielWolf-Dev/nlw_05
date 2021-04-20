import '../styles/globalStyle.scss';
import styles from  '../styles/app.module.scss';

import Header from '../components/Header';
import Player from '../components/Player';

function MyApp({ Component, pageProps }) {
  return(
    <section className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </section>
  );
}

export default MyApp
