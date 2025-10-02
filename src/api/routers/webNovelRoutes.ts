import express from 'express';
import * as titleController from '../controllers/titleController.js';
import * as chapterController from '../controllers/chapterController.js';

import { useToken } from '../middlewares/useToken.js';

export const router = express.Router();

router.post('/', useToken, titleController.createTitle);
router.get('/:webnovelId', titleController.getTitle);
router.delete('/:webnovelId', useToken, titleController.deleteTitle);
router.patch('/:webnovelId', useToken, titleController.updateTitle);

router.post('/:webnovelId/chapters', useToken, chapterController.createChapter);
router.get('/:webnovelId/chapters', chapterController.getChapterList);
router.get('/:webnovelId/chapters/:chapterId', chapterController.getChapter);
router.delete('/:webnovelId/chapters/:chapterId', useToken, chapterController.deleteChapter);
router.patch('/:webnovelId/chapters/:chapterId', useToken, chapterController.updateChapter);

export default router;