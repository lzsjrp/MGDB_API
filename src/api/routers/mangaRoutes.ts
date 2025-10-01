import express from 'express';
import * as mangaController from '../controllers/mangaController.js';
import * as chapterController from '../controllers/chapterController.js';

const router = express.Router();

router.post('/', mangaController.createManga);
router.get('/:mangaId', mangaController.getManga);
router.delete('/:mangaId', mangaController.deleteManga);
router.patch('/:mangaId', mangaController.updateManga);

router.post('/:mangaId/chapters', chapterController.createChapter);
router.get('/:mangaId/chapters', chapterController.getChapterList);
router.get('/:mangaId/chapters/:chapterId', chapterController.getChapter);
router.delete('/:mangaId/chapters/:chapterId', chapterController.deleteChapter);
router.patch('/:mangaId/chapters/:chapterId', chapterController.updateChapter);

export default router;