import { AppDataSource } from "@/db";
import { Track } from "@/db/entities/Track";
import { SpotifyCustomTrack } from "@/server/schemas/spotify";

export class TrackController {

    async getTrack(trackId: string) {
        const track = await AppDataSource.getRepository(Track).findOne({
            where: { id: trackId },
        });

        return track
    }  

    async addTrack(albumId: string, track: SpotifyCustomTrack) {
        await AppDataSource.getRepository(Track).insert({
            id: track.id,
            albumId: albumId,
            name: track.name,
            duration: track.duration_ms,
            externalURL: track.external_urls.spotify,
            detailedData: track
        });
    }   

    async addTracks(albumId: string, tracks: SpotifyCustomTrack[]) {
        const trackEntities = tracks.map(track => ({
            id: track.id,
            albumId: albumId,
            name: track.name,
            duration: track.duration_ms,
            externalURL: track.external_urls.spotify,
            detailedData: track
        }));

        await AppDataSource.getRepository(Track).insert(trackEntities);
    }



}


const trackController = new TrackController();

export default trackController;