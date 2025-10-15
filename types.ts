export interface Song {
  songTitle: string;
  artist: string;
  year: number;
}

export interface Playlist {
  playlistName: string;
  description: string;
  songs: Song[];
}

export enum RefineCategory {
  Genre = "Genre",
  Mood = "Mood",
  Artist = "Artist",
  Trend = "Trend",
}