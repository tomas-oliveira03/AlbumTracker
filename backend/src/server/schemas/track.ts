import { z } from 'zod';

export const trackSchema = z.object({
    id: z.string()
})