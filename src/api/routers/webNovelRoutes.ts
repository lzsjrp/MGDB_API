import express from 'express';
import * as titleController from '../controllers/titleController.js';
import * as chapterController from '../controllers/chapterController.js';

import { useToken } from '../middlewares/useToken.js';

export const router = express.Router();

router.post('/', useToken, titleController.createTitle);
router.get('/:webNovelId', titleController.getTitle);
router.delete('/:webNovelId', useToken, titleController.deleteTitle);
router.patch('/:webNovelId', useToken, titleController.updateTitle);

router.post('/:webNovelId/chapters', useToken, chapterController.createChapter);
router.get('/:webNovelId/chapters', chapterController.getChapterList);
router.get('/:webNovelId/chapters/:chapterId', chapterController.getChapter);
router.delete('/:webNovelId/chapters/:chapterId', useToken, chapterController.deleteChapter);
router.patch('/:webNovelId/chapters/:chapterId', useToken, chapterController.updateChapter);

export default router;