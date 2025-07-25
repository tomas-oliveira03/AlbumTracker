import express from 'express';
import searchRouter from './search';
import healthRouter from './health';
import artistRouter from './artist';
import albumRouter from './album';
import trackRouter from './track';

const router = express.Router();

// Mount sub-routers
router.use('/health', healthRouter);
router.use('/search', searchRouter);
router.use('/artist', artistRouter);
router.use('/album', albumRouter);
router.use('/track', trackRouter);

export default router;
