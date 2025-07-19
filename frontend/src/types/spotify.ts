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
}

export interface Album {
  id: string;
  name: string;
  artists: Artist[];
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
}

export interface SearchResults {
  tracks?: { items: Track[] };
  albums?: { items: Album[] };
  artists?: { items: Artist[] };
}
