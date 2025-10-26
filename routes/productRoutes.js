import express from 'express';
import { handleAlcohol } from '../controllers/productController.js';

const router = express.Router();

/**
 * @route POST /api/products/alcohol
 * @desc Procesa información de producto basado en barcode de 8 dígitos e imagen en base64
 * @access Public
 */
router.post('/alcohol', handleAlcohol);

export default router;
