
export enum Genre {
  All = 'All',
  Action = 'Action',
  Romance = 'Romance',
  Fantasy = 'Fantasy',
  SciFi = 'Sci-Fi',
  Thriller = 'Thriller',
  Horror = 'Horror',
  Drama = 'Drama',
  SliceOfLife = 'Slice of Life',
  Sports = 'Sports',
  Psychological = 'Psychological',
  Shonen = 'Shonen',
  Adventure = 'Adventure',
  Isekai = 'Isekai',
  Mystery = 'Mystery',
  Comedy = 'Comedy',
  Supernatural = 'Supernatural',
  Seinen = 'Seinen',
  Ecchi = 'Ecchi',
  Military = 'Military',
  Music = 'Music',
  School = 'School',
  Shojo = 'Shojo',
  // New Genres to reach 28
  Mecha = 'Mecha',
  Harem = 'Harem',
  Magic = 'Magic',
  Historical = 'Historical',
  Space = 'Space',
  // Additional Genres to support data list
  Josei = 'Josei',
  Vampire = 'Vampire',
  Samurai = 'Samurai',
  ShonenAi = 'Shonen Ai',
  MartialArts = 'Martial Arts',
  Game = 'Game',
  Kids = 'Kids',
  Police = 'Police',
  Cars = 'Cars',
  SuperPower = 'Super Power',
  Dementia = 'Dementia'
}

export enum ListStatus {
  None = 'None',
  Watching = 'Watching',
  Completed = 'Completed',
  Planning = 'Planning'
}

export interface SeasonDetail {
  title: string;
  releaseDate: string;
  episodes: number;
  seasonNumber: number;
}

export interface Anime {
  id: string;
  title: string;
  poster: string;
  rating: number;
  genres: Genre[];
  releaseDate?: string;
  studio?: string;
  synopsis?: string;
  episodes?: number; // Total episodes
  totalSeasons?: number; 
  seasonsDetails?: SeasonDetail[]; // New field for detailed season info
  episodesWatched?: number;
  status?: ListStatus;
  needsEnrichment?: boolean;
  storyReview?: string;
}

export interface UserStats {
  username: string;
  avatar: string;
  watchedCount: number;
  completedCount: number;
  planningCount: number;
  favoriteGenres: Genre[];
}