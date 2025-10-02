import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
    res.json({ version: '1' });
});

import userRoutes from './routers/userRoutes.js'
import sessionRoutes from './routers/sessionRoutes.js'
import mangaRoutes from './routers/mangaRoutes.js'
import webNovelRoutes from './routers/webNovelRoutes.js'
import coversRoutes from './routers/coversRoutes.js'

router.use('/users', userRoutes);
router.use('/session', sessionRoutes);
router.use('/manga', mangaRoutes);
router.use('/webnovel', webNovelRoutes);
router.use('/covers', coversRoutes);


export default router;