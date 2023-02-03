import express from 'express';
import { home, categories, search, notfound } from '../controllers/appController.js';

const router = express.Router();

// Página de inicio
router.get('/', home);

// Categorias 
router.get('/category/:id', categories);

// Buscador
router.post('/search');

// Página 404
router.get('/404');

export default router;
