import express, { Request, Response } from 'express';
import { logger } from '@/lib/logger';
import { getArtistFullInformation } from '@/services/spotify-info';
import { artistSchema } from '../schemas/artist';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
    try{
        const parsedParams = artistSchema.safeParse(req.params);

        if (!parsedParams.success) {
            return res.status(400).json({
                message: 'Invalid artist ID',
                errors: parsedParams.error,
            });
        }

        const { id } = parsedParams.data;
        const artist = await getArtistFullInformation(id); 

        return res.status(200).json(artist);

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