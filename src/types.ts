import { DefaultUser } from 'next-auth';

export interface SessionUser extends DefaultUser {
  role: string;
  id: string;
}

export interface RawgGame {
  added: number;
  added_by_status: object;
  background_image: string;
  clip?: string;
  community_rating: number;
  dominant_color: string;
  esrb_rating?: object;
  genres?: Genre[];
  id: number;
  metacritic?: number;
  name: string;
  parent_platforms: Platform[];
  platforms: Platforms[];
  playtime: number;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  ratings_count: number;
  released: string;
  reviews_count: number;
  reviews_text_count: string;
  saturated_color: string;
  score: string;
  short_screenshots: ScreenShot[];
  slug: string;
  stores: Stores;
  suggestions_count: number;
  tags: Tag[];
  tba: boolean;
  updated: string;
  user_game?: string;
}

export interface RawgGameDetail extends RawgGame {
  name_original: string;
  description: string;
  metacritic_platforms: object[];
  background_image_additional: string;
  website: string;
  reactions: object;
  playtime: number;
  screenshots_count: number;
  movies_count: number;
  creators_count: number;
  achievements_count: number;
  parent_achievements_count: number;
  reddit_url: string;
  reddit_name: string;
  reddit_description: string;
  reddit_logo: string;
  reddit_count: number;
  twitch_count: number;
  youtube_count: number;
  ratings_count: number;
  suggestions_count: number;
  alternative_names: string[];
  metacritic_url: string;
  parents_count: number;
  additions_count: number;
  game_series_count: number;
  user_game?: string;
  developers: Developer[];
  publishers: Developer[];
  description_raw: string;
}

export interface Genre {
  id: number;
  games_count: number;
  image_background: string;
  name: string;
  slug: string;
}

export interface Platforms {
  platform: Platform;
}

export interface Platform {
  games_count: number;
  id: number;
  image?: string;
  image_background: string;
  name: string;
  slug: string;
  year_end?: number;
  year_start?: number;
}

export interface Rating {
  count: number;
  id: number;
  percent: number;
  title: string;
}

export interface ScreenShot {
  id: number;
  image: string;
}

export interface Stores {
  store: Store[];
}

export interface Store {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  games_count: number;
  id: number;
  image_background: string;
  language: string;
  name: string;
  slug: string;
}

export interface Developer {
  games_count: number;
  id: number;
  image_background: string;
  name: string;
  slug: string;
}
