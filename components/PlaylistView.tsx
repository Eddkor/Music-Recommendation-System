import React from 'react';
import { Playlist } from '../types';
import { MusicNoteIcon } from './icons';

interface PlaylistViewProps {
  playlist: Playlist;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({ playlist }) => {
  return (
    <div className="space-y-3">
      {playlist.songs.map((song, index) => (
        <div
          key={index}
          className="flex items-center p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
        >
          <div className="text-slate-400 w-6 text-center mr-4">{index + 1}</div>
          <MusicNoteIcon className="w-6 h-6 text-slate-500 mr-4" />
          <div className="flex-grow">
            <p className="font-semibold text-slate-100 truncate">{song.songTitle}</p>
            <p className="text-sm text-slate-400 truncate">{song.artist}</p>
          </div>
          <div className="text-sm text-slate-400 ml-4">{song.year}</div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistView;