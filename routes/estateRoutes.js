import express from 'express';
import { body } from 'express-validator';
import { admin, save, create } from '../controllers/estateController.js';

const router = express.Router();

router.get('/my-real-estates', admin);
router.get('/real-estate/create', create);
router.post('/real-estate/create',
	body('title')
		.notEmpty()
		.withMessage('El título del anuncio es obligatorio'),
	body('description')
		.notEmpty()
		.withMessage('La descripción no puede ir vacía')
		.isLength({ max: 200 })
		.withMessage('La descripción es muy larga'),
	body('category').isNumeric().withMessage('Selecciona una categoría'),
	body('price').isNumeric().withMessage('Selecciona un rango de precios'),
	body('bedrooms')
		.isNumeric()
		.withMessage('Selecciona la cantidad de habilationes'),
	body('parking')
		.isNumeric()
		.withMessage('Selecciona la cantidad de estacionamientos'),
	body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
	body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),

	save
);

export default router;
