import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
    res.json({ version: '1' });
});

import userRoutes from './routers/userRoutes.js'
import sessionRoutes from './routers/sessionRoutes.js'
import titleRoutes from './routers/titleRoutes.js'

router.use('/users', userRoutes);
router.use('/session', sessionRoutes);
router.use('/title', titleRoutes);

export default router;