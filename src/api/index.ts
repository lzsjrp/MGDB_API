import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
    res.json({ version: '1' });
});

router.use('/users', (await import('./routers/userRoutes.js')).default);
router.use('/session', (await import('./routers/sessionRoutes.js')).default);
router.use('/manga', (await import('./routers/mangaRoutes.js')).default);
router.use('/webnovel', (await import('./routers/webNovelRoutes.js')).default);
router.use('/covers', (await import('./routers/coversRoutes.js')).default);


export default router;