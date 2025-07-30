import spotifyApi from "@/services/spotify-client";

export class SpotifyController {

    async searchForTrack(songName: string) {
        try {
            const response = await spotifyApi.searchTracks(songName, { limit: 15 });
            const tracksContent = response.body.tracks;
            return tracksContent;

        } catch (err) {
            throw new Error('Song search failed');
        }
    }

    async searchForAlbum(albumName: string) {
    try {
        const response = await spotifyApi.searchAlbums(albumName, { limit: 15 });
        const albumsContent = response.body.albums;
        return albumsContent;

    } catch (err) {
        throw new Error('Album search failed');
    }
    }

    async searchForArtist(artistName: string) {
        try {
            const response = await spotifyApi.searchArtists(artistName, { limit: 15 });
            const artistsContent = response.body.artists
            return artistsContent

        } catch (err) {
            throw new Error('Artist search failed');
        }
    }

    async getArtistInfo(artistId: string) {
        try {
            const response = await spotifyApi.getArtist(artistId);
            return response.body;
            
        } catch (err) {
            throw new Error('Failed to retrieve artist info');
        }
    }

    async getAllAlbumsByArtist(artistId: string) {
        try {
            const allAlbums: SpotifyApi.AlbumObjectSimplified[] = [];
            let offset = 0;
            const limit = 50;

            while (true) {
                const response = await spotifyApi.getArtistAlbums(artistId, {
                    limit,
                    offset,
                    include_groups: 'album',
                });

                allAlbums.push(...response.body.items);

                if (response.body.items.length < limit) break; // no more pages
                offset += limit;
            }

            return allAlbums;
        } catch (err) {
            throw new Error('Failed to retrieve artist albums');
        }
    }

    async getArtistFullInformation(artistId: string) {
        const artist = await this.getArtistInfo(artistId)

        const albums = await this.getAllAlbumsByArtist(artistId)

        return {
            artist: artist,
            albums: albums
        }
    }


    async getAlbumInfo(albumId: string){
    try {
            const response = await spotifyApi.getAlbum(albumId);
            return response.body;
            
        } catch (err) {
            throw new Error('Failed to retrieve artist info');
        }
    }

    async getTrackInfo(trackId: string) {
    try {
        const response = await spotifyApi.getTrack(trackId);
        return response.body;
    } catch (err) {
        throw new Error('Failed to get track info');
    }
    }

}

const spotifyController = new SpotifyController();

export default spotifyController;