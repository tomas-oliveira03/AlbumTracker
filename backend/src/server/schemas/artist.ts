import { z } from 'zod';

export const artistSchema = z.object({
    id: z.string()
})