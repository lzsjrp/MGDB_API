import express from 'express';
import multer from 'multer';
import * as coversController from '../controllers/coversController.js';

import { useToken } from '../middlewares/useToken.js';

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router();

router.get("/:titleId", coversController.getCover)

router.post("/:titleId", useToken, upload.single("cover"), coversController.uploadCover)

export default router;