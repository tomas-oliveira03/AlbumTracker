import { AppDataSource } from "@/db";
import { Artist } from "@/db/entities/Artist";
import { getAlbumInfo, getAllAlbumsByArtist, getArtistInfo } from "./spotify-info";
import { Album } from "@/db/entities/Album";
import { AlbumArtist } from "@/db/entities/AlbumArtist";
import { In } from "typeorm";
import { Track } from "@/db/entities/Track";
import { TrackArtist } from "@/db/entities/TrackArtist";

async function syncArtistToDB(artistId: string) {
    try {
        // Check if the artist exists
        const artist = await AppDataSource.getRepository(Artist).findOne({
            where: { id: artistId },
        });
        if (artist) {
            return 
        }
        
        const artistInfo = await getArtistInfo(artistId);

        // Add the artist to the database
        await AppDataSource.getRepository(Artist).insert({
            id: artistInfo.id,
            name: artistInfo.name,
            externalURL: artistInfo.external_urls.spotify,
            imageURL: artistInfo.images[0]?.url || '',
            detailedData: artistInfo
        });
        
    } catch (err) {
        throw new Error('Failed to sync artist to DB');
    }
}


async function syncArtistAlbumsToDB(artistId: string) {
    try {
        const allArtistAlbums = await getAllAlbumsByArtist(artistId)

        const albumIds = allArtistAlbums.map(album => album.id);

        const existingAlbums = await AppDataSource.getRepository(Album).find({
            where: {
                id: In(albumIds)
            },
            select: {
                id: true
            }
        })

        const existingAlbumIds = new Set(existingAlbums.map(album => album.id));
        
        // Filter albums that are NOT in existingAlbumIds (new albums)
        const newAlbums = allArtistAlbums.filter(album => !existingAlbumIds.has(album.id));

        if (newAlbums.length === 0){
            return
        }

        for (const albumData of newAlbums) {

            // Insert album in db
            await AppDataSource.getRepository(Album).insert({
                id: albumData.id,
                name: albumData.name,
                totalTracks: albumData.total_tracks,
                type: albumData.album_type,
                releaseDate: new Date(albumData.release_date),
                externalURL: albumData.external_urls.spotify,
                imageURL: albumData.images[0]?.url || '',
                detailedData: albumData
            })

            // Insert albumArtist relation in db
            await AppDataSource.getRepository(AlbumArtist).insert({
                albumId: albumData.id,
                artistId: artistId
            });

            // Insert tracks in db 


        }
    } catch (err) {
        throw new Error('Failed to sync albums to DB');
    }
}


async function syncArtistAlbumTracksToDB(artistId: string, album: SpotifyApi.AlbumObjectSimplified) {
    try {
        
        // Get the album's tracks
        const albumInfo = await getAlbumInfo(album.id);

        for (const track of albumInfo.tracks.items) {
            // Insert track in db
            await AppDataSource.getRepository(Track).insert({
                id: track.id,
                albumId: album.id,
                name: track.name,
                duration: track.duration_ms,
                externalURL: track.external_urls.spotify,
                detailedData: track
            });

            // Insert TrackArtist relation in db
            await AppDataSource.getRepository(TrackArtist).insert({
                trackId: track.id,
                artistId: artistId
            });
        }

        
    } catch (err) {
        throw new Error('Failed to sync tacks to DB');
    }
}


async function syncAllArtistInformationToDB(artistId: string) {

    // Sync the artist information
    await syncArtistToDB(artistId)
    
    // Sync the artist's albums
    await syncArtistAlbumsToDB(artistId)
}

