import express, { Request, Response } from 'express';
import { treeifyError } from 'zod';
const router = express.Router();
import { logger } from '@/lib/logger';
import { searchByArtistSchema } from '../schemas/search';
import { searchForArtist } from '@/services/spotify-search';


// Seach by artist request
router.get('/artist', async (req: Request, res: Response) => {
    try{
        const parseResult = searchByArtistSchema.safeParse(req.query);

        if (!parseResult.success) {
            const formattedErrors = treeifyError(parseResult.error);
            return res.status(400).json({
                message: 'Invalid query parameters',
                errors: formattedErrors,
            });
        }

        const { name } = parseResult.data;
        const artistInfo = await searchForArtist(name)

        return res.status(200).json(artistInfo);

    }
    catch (error) {
        logger.error(error)
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

export default router;