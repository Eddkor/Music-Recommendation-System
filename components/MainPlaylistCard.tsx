import React from 'react';
import { Playlist } from '../types';
import LoadingSpinner from './LoadingSpinner';
import PlaylistView from './PlaylistView';
import { PlayIcon, ShuffleIcon, MusicNoteIcon } from './icons';

interface MainPlaylistCardProps {
  playlist: Playlist | null;
  isLoading: boolean;
}

const MainPlaylistCard: React.FC<MainPlaylistCardProps> = ({ playlist, isLoading }) => {
  return (
    <div className="w-full bg-gradient-to-br from-cyan-500/30 to-slate-800/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row gap-8 min-h-[400px]">
      {isLoading || !playlist ? (
        <div className="w-full flex items-center justify-center">
            <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="md:w-1/3 flex flex-col justify-between">
            <div>
              <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg mb-4">
                <MusicNoteIcon className="w-24 h-24 text-white/80" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{playlist.playlistName}</h2>
              <p className="text-slate-300 mt-2">{playlist.description}</p>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <button className="flex-1 bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-cyan-300 transition-all duration-300 transform hover:scale-105">
                <PlayIcon className="w-6 h-6" />
                Play
              </button>
              <button className="flex-1 bg-white/10 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-300">
                <ShuffleIcon className="w-5 h-5" />
                Shuffle
              </button>
            </div>
          </div>
          <div className="md:w-2/3 max-h-[350px] md:max-h-full overflow-y-auto pr-2">
            <PlaylistView playlist={playlist} />
          </div>
        </>
      )}
    </div>
  );
};

export default MainPlaylistCard;