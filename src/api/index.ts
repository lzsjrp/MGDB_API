import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
    res.json({ version: '1' });
});

export default router;