import express from 'express';
import multer from '../middlewares/multer.js';

import * as titleController from '../controllers/titleController.js';
import * as coversController from '../controllers/coversController.js';
import * as chapterController from '../controllers/chapterController.js';

import { useToken } from '../middlewares/useToken.js';

export const router = express.Router();

router.post('/', useToken, titleController.createTitle);
router.get('/', titleController.getTitleList);

router.get('/:titleId', titleController.getTitle);
router.delete('/:titleId', useToken, titleController.deleteTitle);
router.patch('/:titleId', useToken, titleController.updateTitle);

router.get('/favorites', useToken, titleController.getFavorites);
router.post('/favorites/sync', useToken, titleController.syncFavorites);
router.post('/:titleId/favorite', useToken, titleController.addFavorite);

router.get("/:titleId/cover", coversController.getCover)
router.post("/:titleId/cover", useToken, multer.single("image"), coversController.uploadCover)

router.post('/:titleId/chapters', useToken, chapterController.createChapter);
router.get('/:titleId/chapters', chapterController.getChapterList);

router.get('/:titleId/chapters/:chapterId', chapterController.getChapter);
router.post('/:titleId/chapters/:chapterId', useToken, multer.single("image"), chapterController.chapterPageUpload);
router.delete('/:titleId/chapters/:chapterId', useToken, chapterController.deleteChapter);
router.patch('/:titleId/chapters/:chapterId', useToken, chapterController.updateChapter);

export default router;