import express, { Request, Response } from 'express';
import { treeifyError } from 'zod';
import { logger } from '@/lib/logger';
import { searchByAlbumSchema, searchByArtistSchema, searchByTrackSchema } from '../schemas/search';
import { searchForAlbum, searchForArtist, searchForTrack } from '@/services/spotify-info';

const router = express.Router();

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
        const artistsInfo = await searchForArtist(name)

        return res.status(200).json(artistsInfo);

    }
    catch (error) {
        logger.error(error)
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});


router.get('/album', async (req: Request, res: Response) => {
    try{
        const parseResult = searchByAlbumSchema.safeParse(req.query);

        if (!parseResult.success) {
            const formattedErrors = treeifyError(parseResult.error);
            return res.status(400).json({
                message: 'Invalid query parameters',
                errors: formattedErrors,
            });
        }

        const { name } = parseResult.data;
        const albumsInfo = await searchForAlbum(name)

        return res.status(200).json(albumsInfo);

    }
    catch (error) {
        logger.error(error)
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});


router.get('/track', async (req: Request, res: Response) => {
    try{
        const parseResult = searchByTrackSchema.safeParse(req.query);

        if (!parseResult.success) {
            const formattedErrors = treeifyError(parseResult.error);
            return res.status(400).json({
                message: 'Invalid query parameters',
                errors: formattedErrors,
            });
        }

        const { name } = parseResult.data;
        const tracksInfo = await searchForTrack(name)

        return res.status(200).json(tracksInfo);

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

