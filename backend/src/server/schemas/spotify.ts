export type SpotifyCustomTrack = SpotifyApi.TrackObjectSimplified & {
     album: SpotifyApi.AlbumObjectSimplified;
}


export function albumResponseToCustomTracks(albumResp: SpotifyApi.SingleAlbumResponse): SpotifyCustomTrack[] {
  const albumSimplified: SpotifyApi.AlbumObjectSimplified = {
      id: albumResp.id,
      name: albumResp.name,
      uri: albumResp.uri,
      href: albumResp.href,
      external_urls: albumResp.external_urls,
      images: albumResp.images,
      album_type: albumResp.album_type,
      artists: albumResp.artists,
      release_date: albumResp.release_date,
      release_date_precision: albumResp.release_date_precision,
      total_tracks: albumResp.total_tracks,
      type: albumResp.type
  };

  return albumResp.tracks.items.map(track => ({
    ...track,          // spread TrackObjectSimplified properties directly
    album: albumSimplified,  // add album property
  }));
}


export function trackResponseToCustomTrack(trackResp: SpotifyApi.SingleTrackResponse): SpotifyCustomTrack {
  const albumFull = trackResp.album;

  const albumSimplified: SpotifyApi.AlbumObjectSimplified = {
      id: albumFull.id,
      name: albumFull.name,
      uri: albumFull.uri,
      href: albumFull.href,
      external_urls: albumFull.external_urls,
      images: albumFull.images,
      album_type: albumFull.album_type,
      artists: albumFull.artists,
      release_date: albumFull.release_date,
      release_date_precision: albumFull.release_date_precision,
      total_tracks: albumFull.total_tracks,
      type: albumFull.type
  };

  // Build simplified track with all needed properties + album
  const trackSimplified: SpotifyCustomTrack = {
      id: trackResp.id,
      name: trackResp.name,
      duration_ms: trackResp.duration_ms,
      explicit: trackResp.explicit,
      track_number: trackResp.track_number,
      preview_url: trackResp.preview_url,
      uri: trackResp.uri,
      href: trackResp.href,
      external_urls: trackResp.external_urls,
      artists: trackResp.artists.map(artist => ({
          id: artist.id,
          name: artist.name,
          uri: artist.uri,
          href: artist.href,
          external_urls: artist.external_urls,
          type: artist.type,
      })),
      disc_number: trackResp.disc_number,
      type: trackResp.type,

      album: albumSimplified, // add album here
  };

  return trackSimplified;
}