import express from 'express';
import multer from 'multer';
import path from 'path';
import * as coversController from '../controllers/coversController.js';

import { useToken } from '../middlewares/useToken.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'covers/')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, req.params.titleId + ext)
    }
})

function fileFilter(req, file, cb) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        return cb(new Error('Image type not supported'));
    }
    cb(null, true);
}

const upload = multer({ storage, fileFilter })

const router = express.Router();

router.get("/:titleId", coversController.getCover)

router.post("/:titleId", useToken, upload.single("cover"), coversController.uploadCover)

export default router;