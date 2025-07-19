import express from 'express';
import searchRouter from './search';
import healthRouter from './health';
import artistRouter from './artist';
import albumRouter from './album';

const router = express.Router();

// Mount sub-routers
router.use('/health', healthRouter);
router.use('/search', searchRouter);
router.use('/artist', artistRouter);
router.use('/album', albumRouter);

export default router;
