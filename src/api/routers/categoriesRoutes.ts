import express from 'express';

import * as categoriesController from '../controllers/categoriesController.js';

import { useToken } from '../middlewares/useToken.js';

export const router = express.Router();

router.get('/', categoriesController.getAllCategories);

router.post('/', useToken, categoriesController.createCategory);
router.get('/:categoryId', categoriesController.getCategoryById);
router.patch('/:categoryId', useToken, categoriesController.updateCategory);
router.delete('/:categoryId', useToken, categoriesController.deleteCategory);

router.post('/:categoryId/book', useToken, categoriesController.addBookToCategory);
router.delete('/:categoryId/book', useToken, categoriesController.deleteBookFromCategory);

export default router; 