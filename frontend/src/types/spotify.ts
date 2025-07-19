export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  id: string;
  name: string;
  images?: SpotifyImage[];
  genres?: string[];
  followers?: {
    total: number;
  };
  popularity?: number;
  external_urls?: {
    spotify: string;
  };
  type?: string;
  href?: string;
  uri?: string;
}

export interface Album {
  id: string;
  name: string;
  artists: Artist[];
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  type?: string;
  album_type?: string;
  popularity?: number;
  label?: string;
  external_urls?: {
    spotify: string;
  };
  copyrights?: {
    text: string;
    type: string;
  }[];
  tracks?: {
    items: Track[];
    total: number;
  };
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  type?: string;
}

export interface SearchResults {
  items: (Track | Album | Artist)[];
  href?: string;
  limit?: number;
  next?: string | null;
  offset?: number;
  previous?: string | null;
  total?: number;
}
