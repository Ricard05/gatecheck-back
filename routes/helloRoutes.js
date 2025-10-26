import express from 'express';
import { sayHello } from '../controllers/helloController.js';

const router = express.Router();

/**
 * @route GET /api/hello
 * @desc Retorna un mensaje de hola mundo
 * @access Public
 */
router.get('/', sayHello);

export default router;
