import { z } from 'zod';

export const searchByArtistSchema = z.object({
    name: z.string()
})

export const searchByAlbumSchema = z.object({
    name: z.string()
})

export const searchByTrackSchema = z.object({
    name: z.string()
})