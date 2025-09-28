import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
    res.json({ version: '1' });
});

router.use('/users', (await import('./routers/userRoutes')).default);
router.use('/session', (await import('./routers/sessionRoutes')).default);

export default router;