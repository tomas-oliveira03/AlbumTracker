import express, { Request, Response } from 'express';
import { logger } from '@/lib/logger';
import { trackSchema } from '../schemas/track';
import spotifyController from '@/controller/spotify';
import { trackResponseToCustomTrack } from '../schemas/spotify';


const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
    try{
        const parsedParams = trackSchema.safeParse(req.params);

        if (!parsedParams.success) {
            return res.status(400).json({ 
                message: 'Invalid artist ID',
                errors: parsedParams.error,
            });
        }

        const { id } = parsedParams.data;
        const fullTrack = await spotifyController.getTrackInfo(id);
        
        const customTrackInfo = trackResponseToCustomTrack(fullTrack)


        return res.status(200).json(customTrackInfo);

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