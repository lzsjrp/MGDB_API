import * as sessionController from '../controllers/sessionController.js';

import { Router } from 'express';
import { useToken } from '../middlewares/useToken.js';

const router = Router();

router.get('/', useToken, sessionController.getSession);
router.post('/', sessionController.createSession);

export default router;