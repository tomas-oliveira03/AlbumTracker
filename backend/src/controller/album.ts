import { AppDataSource } from "@/db";
import { Album } from "@/db/entities/Album";
import artistController from "./artist";
import spotifyController from "./spotify";
import { AlbumArtist } from "@/db/entities/AlbumArtist";
import trackController from "./track";
import { albumResponseToCustomTracks } from "@/server/schemas/spotify";

export class AlbumController {

    async getAlbum(albumId: string) {
        const album = await AppDataSource.getRepository(Album).findOne({
            where: { id: albumId },
        });

        return album
    }  

    async getAllAlbumsByArtist(artistId: string) {
        const albums = await AppDataSource.getRepository(Album).find({
            relations: {
                artistLinks: true
            },
            where: {
                artistLinks: {
                    artistId: artistId
                }
            }
        });
        
        return albums;
    }  

    async addAlbum(album: SpotifyApi.SingleAlbumResponse) {
        const albumExists = await this.getAlbum(album.id)
        if(albumExists){
            return
        }

        await AppDataSource.getRepository(Album).insert({
            id: album.id,
            name: album.name,
            totalTracks: album.total_tracks,
            type: album.album_type,
            releaseDate: new Date(album.release_date),
            externalURL: album.external_urls.spotify,
            imageURL: album.images[0]?.url || '',
            detailedData: album
        });
    }   

    async addAlbumArtistLinks( albumArtistLinks: { albumId: string;artistId: string }[]) {
        await AppDataSource.getRepository(AlbumArtist).upsert(albumArtistLinks, ["albumId", "artistId"]);
    }   

    async addAlbumCascade(album: SpotifyApi.SingleAlbumResponse) {

        // Check if all artists who created this album exist in the database
        const artistIds = album.artists.map(artist => artist.id);
        const existingArtists = await artistController.getAllArtists(artistIds)

        const existingArtistIds = new Set(existingArtists.map(artist => artist.id));
        const missingArtistIds = artistIds.filter(id => !existingArtistIds.has(id));

        // Insert all the missing creator artists in the database
        for (const artistId of missingArtistIds){
            const artistFromSpotify = await spotifyController.getArtistInfo(artistId);
            await artistController.addArtist(artistFromSpotify)
        }

        await this.addAlbum(album)

        // Add the link between artist and album database
        const albumArtistLinks = album.artists.map(artist => ({
            albumId: album.id,
            artistId: artist.id
        }));

        await this.addAlbumArtistLinks(albumArtistLinks)

        const customTracksInfo = albumResponseToCustomTracks(album) 
        await trackController.addTracks(album.id, customTracksInfo)

    }   

    async addAlbumsFromArtistCascade(artistId: string, simplifiedAlbums: SpotifyApi.AlbumObjectSimplified[]) {
        for (const simplifiedAlbum of simplifiedAlbums){
            const album = await spotifyController.getAlbumInfo(simplifiedAlbum.id)
            await this.addAlbumCascade(album)
        }

        await artistController.updateArtist(artistId, {
            albumsScanned: true
        })
    }  
}


const albumController = new AlbumController();

export default albumController;