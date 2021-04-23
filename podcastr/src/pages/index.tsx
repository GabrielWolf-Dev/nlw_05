import { GetStaticProps } from 'next'; // Especificar a tipagem da função como um todo.
import Link from 'next/link';
import { api } from '../services/api';
import Image from 'next/image';
import Head from 'next/head';

import { durationToString } from '../utils/convertDuration';
import { usePlayer } from '../contexts/PlayerContext';

import styles from './home.module.scss';

type Episode = {
    id: string,
    title: string,
    members: string,
    published_at: string,
    publishedAt: string,
    thumbnail: string,
    durationAsString: string,
    duration: number,
    url: string,
    type: string,
}

type Homeprops = {
  lastestEpisodes: Array<Episode>,
  allEpisodes: Array<Episode>
}

export default function Home({ lastestEpisodes, allEpisodes }: Homeprops) {
  const { playList } = usePlayer();
  const episodeList = [...lastestEpisodes, ...allEpisodes];

  return (
    <main className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.lastEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {
            lastestEpisodes.map((episode, index) => {
              return (
                <li key={episode.id}>
                  <Image
                    width={192} 
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title}
                    objectFit="cover"
                  />

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button type="button" onClick={() => playList(episodeList, index)}>
                    <img src="/svg/play-green.svg" alt="Tocar episódio" />
                  </button>
                </li>
              );
            })
          }
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              allEpisodes.map((episode, index) => {
                return(
                  <tr key={episode.id}>
                    <td style={{ width: '72px' }}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: '120px' }}>{episode.publishedAt.replace(/de/g, "")}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => playList(episodeList, index + lastestEpisodes.length)}>
                        <img src="/svg/play-green.svg" alt="Tocar episódio" />
                      </button>
                    </td>
                  </tr> 
                );
              })
            }
          </tbody>
        </table>
      </section>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', { // Podemos passar os parâmetros de uma URL em Js em Obj.
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: new Date(episode.published_at).toLocaleDateString('BRL', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      }),
      thumbnail: episode.thumbnail,
      duration: Number(episode.file.duration),
      durationAsString: durationToString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  });

  const lastestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      lastestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8 // Vai reenviar a página HTML em 8hrs novamente.
  }
}
