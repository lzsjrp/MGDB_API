import express from 'express';

import * as titleController from '../controllers/titleController.js';

import { useToken } from '../middlewares/useToken.js';

export const router = express.Router();

router.get('/', useToken, titleController.getFavorites);
router.post('/sync', useToken, titleController.syncFavorites);
router.post('/book/:titleId', useToken, titleController.addFavorite);
router.delete('/book/:titleId', useToken, titleController.removeFavorite);

export default router;