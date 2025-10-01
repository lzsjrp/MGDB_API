import express from 'express';
import * as webnovelController from '../controllers/webNovelController.js';
import * as chapterController from '../controllers/chapterController.js';

import { useToken } from '../middlewares/useToken.js';

export const router = express.Router();

router.post('/', useToken, webnovelController.createWebNovel);
router.get('/:webnovelId', webnovelController.getWebNovel);
router.delete('/:webnovelId', useToken, webnovelController.deleteWebNovel);
router.patch('/:webnovelId', useToken, webnovelController.updateWebNovel);

router.post('/:webnovelId/chapters', useToken, chapterController.createChapter);
router.get('/:webnovelId/chapters/:chapterId', chapterController.getChapter);
router.delete('/:webnovelId/chapters/:chapterId', useToken, chapterController.deleteChapter);
router.patch('/:webnovelId/chapters/:chapterId', useToken, chapterController.updateChapter);

export default router;