import React from 'react';
import { Playlist, RefineCategory } from '../types';
import PlaylistView from './PlaylistView';
import LoadingSpinner from './LoadingSpinner';

interface RefineSectionProps {
  onRefine: (category: RefineCategory) => void;
  refinedPlaylists: Partial<Record<RefineCategory, Playlist>>;
  loadingStates: Partial<Record<RefineCategory, boolean>>;
}

const RefineButton: React.FC<{
  category: RefineCategory;
  onClick: (category: RefineCategory) => void;
  isLoading: boolean;
}> = ({ category, onClick, isLoading }) => (
  <button
    onClick={() => onClick(category)}
    disabled={isLoading}
    className="w-full text-left p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-slate-400">Discover by</p>
        <p className="text-lg font-bold text-white">{category}</p>
      </div>
      {isLoading && <LoadingSpinner />}
    </div>
  </button>
);

const RefineSection: React.FC<RefineSectionProps> = ({ onRefine, refinedPlaylists, loadingStates }) => {
  const categories = Object.values(RefineCategory);

  return (
    <div className="w-full mt-12">
      <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center md:text-left">Or, Refine Your Discovery</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const playlist = refinedPlaylists[category];
          const isLoading = loadingStates[category] || false;
          return (
            <div key={category} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex flex-col gap-4">
              <RefineButton category={category} onClick={onRefine} isLoading={isLoading} />
              <div className="flex-grow min-h-[200px] max-h-[300px] overflow-y-auto">
                {playlist ? (
                  <PlaylistView playlist={playlist} />
                ) : (
                  !isLoading && (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      Click to generate a playlist.
                    </div>
                  )
                )}
                {isLoading && !playlist && <LoadingSpinner />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RefineSection;