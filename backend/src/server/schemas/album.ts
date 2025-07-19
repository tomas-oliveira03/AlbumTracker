import { z } from 'zod';

export const albumSchema = z.object({
    id: z.string()
})