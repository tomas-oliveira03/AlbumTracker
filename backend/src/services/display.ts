import artistController from "@/controller/artist";
import spotifyController from "@/controller/spotify";


export async function displayArtist(artistId: string) {
    try{
        const artist = await artistController.getArtist(artistId)
        const albums = await spotifyController.getAllAlbumsByArtist(artistId)

        if (artist) {
            console.log("HAS IT")
            return {
                artist: artist.detailedData,
                albums: albums
            }
        }
        console.log("NOP")
        const artistInfo = await spotifyController.getArtistInfo(artistId);

        // Doesn't wait for result so the end user doesn't have to wait longer
        artistController.addArtist(artistInfo)

          return {
            artist: artistInfo,
            albums: albums
        }

    }
    catch (err) {
        throw new Error(`Failed to display artist information: ${err.message}`);
    }
}