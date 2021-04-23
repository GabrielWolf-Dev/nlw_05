import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import { usePlayer } from '../../contexts/PlayerContext';
import { api } from '../../services/api';
import { durationToString } from '../../utils/convertDuration';
import styles from './episode.module.scss';

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
    description: string,
};

type EpisodeProps = {
    episode: Episode,
};

export default function Episode({ episode }: EpisodeProps) {
    const { play } = usePlayer();

    return(
        <section className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href='/'>
                    <button type="button">
                        <img src="/svg/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>

                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/svg/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{__html: episode.description}}
            />
        </section>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc',
        }
    });

    const paths = data.map((episode) => {
        return {
            params: {
                slug: episode.id,
            }
        }
    });

    return {
        paths,
        fallback: "blocking", // Renderiza o json no servidor do next.js
    };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        publishedAt: new Date(data.published_at).toLocaleDateString('BRL', {
          day: 'numeric',
          month: 'short',
          year: '2-digit',
        }),
        thumbnail: data.thumbnail,
        duration: Number(data.file.duration),
        durationAsString: durationToString(Number(data.file.duration)),
        url: data.file.url,
        description: data.description,
    };

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24 // 24 hours
    }
}
