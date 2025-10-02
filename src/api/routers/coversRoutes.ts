import express from 'express';
import multer from '../middlewares/multer.js';
import * as coversController from '../controllers/coversController.js';

import { useToken } from '../middlewares/useToken.js';

const router = express.Router();

router.get("/:titleId", coversController.getCover)

router.post("/:titleId", useToken, multer.single("image"), coversController.uploadCover)

export default router;