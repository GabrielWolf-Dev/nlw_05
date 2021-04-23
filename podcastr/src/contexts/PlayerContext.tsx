import { useState, ReactNode, useContext } from 'react';
import { createContext } from 'react';

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string,
}

type PlayerContextData = {
    episodeList: Array<Episode>,
    currentEpisode: number,
    isPlaying: boolean,
    play: (episode: Episode) => void,
    setPlayingState: (state: boolean) => void,
    playList: (list: Episode[], index: number) => void,
    playPrevious: () => void,
    playNext: () => void,
    hasNext: boolean,
    hasPrevious: boolean,
    togglePlay: () => void,
    isLooping: boolean,
    toggleLoop: () => void,
    isShuffling: boolean,
    toggleShuffle: () => void,
    clearPlayerState: () => void,
};

type PlayerContextProviderProps = {
  children: ReactNode,
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisode, setCurrentEpisode] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
      setEpisodeList([episode]);
      setCurrentEpisode(0);
      setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
      setEpisodeList(list);
      setCurrentEpisode(index);
      setIsPlaying(true);
    }

    function togglePlay(){
      setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
      setIsLooping(!isLooping);
    }

    function toggleShuffle() {
      setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
      setIsPlaying(state);
    }

    const hasNext = isShuffling || (currentEpisode + 1) < episodeList.length;
    const hasPrevious = currentEpisode > 0;

    function playNext() {
      if(isShuffling) {
        const nextRandomEpisode = Math.floor(Math.random() * episodeList.length);

        setCurrentEpisode(nextRandomEpisode);
      } else if(hasNext) {
        setCurrentEpisode(currentEpisode + 1);
      }
    }

    function playPrevious() {
      if(hasPrevious){
        setCurrentEpisode(currentEpisode - 1);
      }
    }

    function clearPlayerState() {
      setEpisodeList([]);
      setCurrentEpisode(0);
    }

    return (
        <PlayerContext.Provider
        value={{
            episodeList,
            currentEpisode,
            play,
            playList,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            togglePlay,
            isPlaying,
            setPlayingState,
            isLooping,
            toggleLoop,
            isShuffling,
            toggleShuffle,
            clearPlayerState,
        }}>
          {children /* Repassa todo conteúdo dentro da função */}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);
