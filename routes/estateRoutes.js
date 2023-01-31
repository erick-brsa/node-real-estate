import express from 'express';
import { body } from 'express-validator';
import { admin, save, create, addImage, saveImages, edit, saveChanges, deleteEstate, showEstate } from '../controllers/estateController.js';
import protectRoute from '../middleware/protectRoute.js';
import upload from '../middleware/uploadFile.js';

const router = express.Router();

router.get('/my-real-estates', protectRoute, admin);
router.get('/real-estate/create', protectRoute, create);
router.post('/real-estate/create', protectRoute,
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
router.get('/real-estate/add-image/:id', protectRoute, addImage);
router.post('/real-estate/add-image/:id', protectRoute, upload.single('image'), saveImages);
router.get('real-estate/edit/:id', protectRoute, edit);

router.post('/real-estate/edit/:id', protectRoute,
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
	saveChanges
);

router.post('/real-estate/delete/:id', protectRoute, deleteEstate);

// Área pública
router.get('/estate/:id', showEstate);

export default router;
