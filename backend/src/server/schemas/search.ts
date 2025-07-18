import { z } from 'zod';

export const searchByArtistSchema = z.object({
    name: z.string()
})