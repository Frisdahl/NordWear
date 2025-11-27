import { Router } from 'express';
import { getProducts, createProduct, getCategories } from '../controllers/products.controller';

const router = Router();

router.get('/products', getProducts);
router.post('/products', createProduct);
router.get('/categories', getCategories);

export default router;