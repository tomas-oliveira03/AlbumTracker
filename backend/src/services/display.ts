import albumController from "@/controller/album";
import artistController from "@/controller/artist";
import spotifyController from "@/controller/spotify";


export async function displayArtist(artistId: string) {
    try{
        const artist = await artistController.getArtist(artistId)

        // CASE 1: Artist is in DB and albums are already scanned
        if (artist && artist.albumsScanned){
            console.log("CASE 1 ")
            const albums = await albumController.getAllAlbumsByArtist(artistId)
            const albumsDetailedData = albums.map(album => album.detailedData);

            return {
                artist: artist.detailedData,
                albums: albumsDetailedData
            }
        }

        // CASE 2: Artist is in DB but albums not yet scanned
        if (artist && !artist.albumsScanned) {
            console.log("CASE 2 ")
            const albumsFromSpotify = await spotifyController.getAllAlbumsByArtist(artistId)

            // Doesn't wait for result so the end user doesn't have to wait longer
            albumController.addAlbumsFromArtistCascade(artistId, albumsFromSpotify)

            return {
                artist: artist.detailedData,
                albums: albumsFromSpotify
            }

        }

        console.log("CASE 3 ")
        // CASE 3: Artist not in DB at all
        const artistFromSpotify = await spotifyController.getArtistInfo(artistId);
        const albumsFromSpotify = await spotifyController.getAllAlbumsByArtist(artistId)

        // Doesn't wait for result so the end user doesn't have to wait longer
        artistController.addArtist(artistFromSpotify)
            .then(() => {
                albumController.addAlbumsFromArtistCascade(artistId, albumsFromSpotify)
            })

        return {
            artist: artistFromSpotify,
            albums: albumsFromSpotify
        }

    }
    catch (err) {
        throw new Error(`Failed to display artist information: ${err.message}`);
    }
}

