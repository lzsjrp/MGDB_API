import * as userController from '../controllers/userController.js';

import { Router } from 'express';
import { useToken } from '../middlewares/useToken.js';

const router = Router();

router.get('/', useToken, userController.getSessionUser)
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.delete('/:id', useToken, userController.deleteUser);
router.patch('/:id', useToken, userController.updateUser);

export default router;