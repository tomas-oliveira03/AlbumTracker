import { AppDataSource } from "@/db";
import { Artist } from "@/db/entities/Artist";
import { DeepPartial, In } from "typeorm";


export class ArtistController {

    async getArtist(artistId: string) {
        const artist = await AppDataSource.getRepository(Artist).findOne({
            where: { id: artistId },
        });

        return artist
    }  

    async getAllArtists(artistIds: string[]) {
        const artists = await AppDataSource.getRepository(Artist).find({
            where: { id: In(artistIds) },
        });

        return artists
    }  

    async addArtist(artist: SpotifyApi.SingleArtistResponse) {
        const artistExists = await this.getArtist(artist.id)
        if(artistExists){
            return
        }

        await AppDataSource.getRepository(Artist).insert({
            id: artist.id,
            name: artist.name,
            externalURL: artist.external_urls.spotify,
            imageURL: artist.images[0]?.url || '',
            detailedData: artist
        });
    }   

    async updateArtist(artistId: string, updatedData: DeepPartial<Artist>) {
        await AppDataSource.getRepository(Artist).update(artistId, updatedData);
    } 

}


const artistController = new ArtistController();

export default artistController;