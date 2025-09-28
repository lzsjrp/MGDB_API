import * as sessionController from '../controllers/sessionController';

import { Router } from 'express';
import { useToken } from '../middlewares/useToken';

const router = Router();

router.get('/', useToken, sessionController.getSession);
router.post('/', sessionController.createSession);

export default router;