import albumController from "@/controller/album";
import artistController from "@/controller/artist";
import spotifyController from "@/controller/spotify";
import trackController from "@/controller/track";
import { trackResponseToCustomTrack } from "@/server/schemas/spotify";


export async function displayArtist(artistId: string) {
    try{
        const artist = await artistController.getArtist(artistId)

        // CASE 1: Artist is in DB and albums are already scanned
        if (artist && artist.albumsScanned){
            const albums = await albumController.getAllAlbumsByArtist(artistId)
            const albumsDetailedData = albums.map(album => album.detailedData);

            return {
                artist: artist.detailedData,
                albums: albumsDetailedData
            }
        }

        // CASE 2: Artist is in DB but albums not yet scanned
        if (artist && !artist.albumsScanned) {
            const albumsFromSpotify = await spotifyController.getAllAlbumsByArtist(artistId)

            // Doesn't wait for result so the end user doesn't have to wait longer
            albumController.addAlbumsFromArtistCascade(artistId, albumsFromSpotify)
                .catch((err) => {
                    console.error("Background display artist information failed (Artist exists):", err);
                });

            return {
                artist: artist.detailedData,
                albums: albumsFromSpotify
            }

        }

        // CASE 3: Artist not in DB at all
        const artistFromSpotify = await spotifyController.getArtistInfo(artistId);
        const albumsFromSpotify = await spotifyController.getAllAlbumsByArtist(artistId)

        // Doesn't wait for result so the end user doesn't have to wait longer
        artistController.addArtist(artistFromSpotify)
            .then(() => {
                albumController.addAlbumsFromArtistCascade(artistId, albumsFromSpotify)
            })
            .catch((err) => {
                console.error("Background display artist information failed (Artist does not exist):", err);
            });

        return {
            artist: artistFromSpotify,
            albums: albumsFromSpotify
        }

    }
    catch (err) {
        throw new Error(`Failed to display artist information: ${err.message}`);
    }
}


export async function displayAlbum(albumId: string) {
    try{
        const album = await albumController.getAlbum(albumId)

        // CASE 1: Album is in DB
        if (album){
            return album.detailedData
        }

        // CASE 2: Album is not in DB
        const albumFromSpotify = await spotifyController.getAlbumInfo(albumId)
        const firstArtistId = albumFromSpotify.artists[0]?.id

        if (!firstArtistId){
            throw new Error(`Failed to display album information (First artist).`);
        }

        // Doesn't wait for result so the end user doesn't have to wait longer
        spotifyController.getAllAlbumsByArtist(firstArtistId)
            .then((albumsFromSpotify) => {
                albumController.addAlbumsFromArtistCascade(firstArtistId, albumsFromSpotify)
            })
            .catch((err) => {
                console.error("Background display album information failed:", err);
            });

        return albumFromSpotify
    }
    catch (err) {
        throw new Error(`Failed to display album information: ${err.message}`);
    }
}


export async function displayTrack(trackId: string) {
    try{
        const track = await trackController.getTrack(trackId)

        // CASE 1: Track is in DB
        if (track){
            return track.detailedData
        }

        // CASE 2: Album is not in DB
        const trackFromSpotify = await spotifyController.getTrackInfo(trackId)
        const firstArtistId = trackFromSpotify.album.artists[0]?.id

        if (!firstArtistId){
            throw new Error(`Failed to display track information (First artist).`);
        }

        // Doesn't wait for result so the end user doesn't have to wait longer
        spotifyController.getAllAlbumsByArtist(firstArtistId)
            .then((albumsFromSpotify) => {
                albumController.addAlbumsFromArtistCascade(firstArtistId, albumsFromSpotify)
            })
            .catch((err) => {
                console.error("Background display track information failed:", err);
            });

        const customTrackInfo = trackResponseToCustomTrack(trackFromSpotify)
        return customTrackInfo
    }
    catch (err) {
        throw new Error(`Failed to display track information: ${err.message}`);
    }
}
