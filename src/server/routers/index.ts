import express from 'express';
import searchRouter from './search';
import healthRouter from './health';

const router = express.Router();

// Mount sub-routers
router.use('/health', healthRouter);
router.use('/search', searchRouter);

export default router;
