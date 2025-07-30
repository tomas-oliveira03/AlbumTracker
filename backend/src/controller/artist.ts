import { AppDataSource } from "@/db";
import { Artist } from "@/db/entities/Artist";


export class ArtistController {

    async getArtist(artistId: string) {
        const artist = await AppDataSource.getRepository(Artist).findOne({
            where: { id: artistId },
        })

        return artist
    }  

    async addArtist(artist: SpotifyApi.SingleArtistResponse) {
        await AppDataSource.getRepository(Artist).insert({
            id: artist.id,
            name: artist.name,
            externalURL: artist.external_urls.spotify,
            imageURL: artist.images[0]?.url || '',
            detailedData: artist
        });
    }   

}



const artistController = new ArtistController();

export default artistController;