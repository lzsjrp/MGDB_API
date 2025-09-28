import * as userController from '../controllers/userController';

import { Router } from 'express';
import { useToken } from '../middlewares/useToken';

const router = Router();

router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.delete('/:id', useToken, userController.deleteUser);
router.patch('/:id', useToken, userController.updateUser);

export default router;