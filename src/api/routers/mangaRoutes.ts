import express from 'express';
import * as titleController from '../controllers/titleController.js';
import * as chapterController from '../controllers/chapterController.js';

import { useToken } from '../middlewares/useToken.js';

const router = express.Router();

router.post('/', useToken, titleController.createTitle);
router.get('/:mangaId', titleController.getTitle);
router.delete('/:mangaId', useToken, titleController.deleteTitle);
router.patch('/:mangaId', useToken, titleController.updateTitle);

router.post('/:mangaId/chapters', useToken, chapterController.createChapter);
router.get('/:mangaId/chapters', chapterController.getChapterList);
router.get('/:mangaId/chapters/:chapterId', chapterController.getChapter);
router.delete('/:mangaId/chapters/:chapterId', useToken, chapterController.deleteChapter);
router.patch('/:mangaId/chapters/:chapterId', useToken, chapterController.updateChapter);

export default router;