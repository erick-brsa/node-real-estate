import { unlink } from 'node:fs/promises';
import { validationResult } from 'express-validator';
import { Price, Category, Estate } from '../models/index.js';

export const admin = async (req, res) => {
	const { id } = req.user;

    const estates = await Estate.findAll({
        where: { userId: id },
		include: [
			{ model: Category, as: 'category' },
			{ model: Price, as: 'price' }
		]
    })

	res.render('estate/admin', {
		page: `Mis propiedades`,
		csrfToken: req.csrfToken(),
        estates
	});
};

export const create = async (req, res) => {
	const [categories, prices] = await Promise.all([
		Category.findAll(),
		Price.findAll()
	]);

	res.render('estate/create', {
		page: 'Crear propiedad',
		csrfToken: req.csrfToken(),
		categories,
		prices,
		data: {}
	});
};

export const save = async (req, res) => {
	// Validación
	let result = validationResult(req);

	if (!result.isEmpty()) {
		const [categories, prices] = await Promise.all([
			Category.findAll(),
			Price.findAll()
		]);

		return res.render('estate/create', {
			page: 'Crear propiedad',
			csrfToken: req.csrfToken(),
			categories,
			prices,
			errors: result.array(),
			data: req.body
		});
	}

	// Guardar registro
	const { title, description, category, price, bedrooms, parking, wc, street, lat, lng } = req.body;
	const { id: userId } = req.user;

	try {
		const savedData = await Estate.create({
			title, description, bedrooms, parking, wc, street, lat,
			lng, priceId: price,categoryId: category, userId, image: ''
		});
        console.log(savedData)
		const { id } = savedData;
		res.redirect(`/real-estate/add-image/${id}`);
	} catch (error) {
		console.log(error);
	}
};

export const addImage = async (req, res) => {
	// Validar que la propiedad exista
	const { id } = req.params;

	const estate = await Estate.findByPk(id);

	if (!estate) {
		res.redirect('/my-real-estates');
	}

	// Validar que la propiedad no esté publicada
	if (estate.published) {
        res.redirect('/my-real-estates');
	}
    
	// Validar que la propiedad pertenece al quien visite la página
	if (estate.userId.toString() !== req.user.id.toString()) {
		res.redirect('/my-real-estates');
	}
    
	res.render('estate/add-image', {
		page: `Agregar imagen: ${estate.title}`,
		csrfToken: req.csrfToken(),
		estate
	});
};

export const saveImages = async (req, res, next) => {
	// Validar que la propiedad exista
	const { id } = req.params;

	const estate = await Estate.findByPk(id);

	if (!estate) {
		res.redirect('/my-real-estates');
	}

	// Validar que la propiedad no esté publicada
	if (estate.published) {
		res.redirect('/my-real-estates');
	}

	// Validar que la propiedad pertenece al quien visite la página
	if (estate.id.toString() !== req.user.id.toString()) {
		res.redirect('/my-real-estates');
	}
	try {
		// Almacenar la imagen y publicar propiedad
		estate.image = req.file.filename;
		estate.published = 1;
		await estate.save();
		next();
	} catch (error) {
		console.log(error);
	}
};

export const edit = async (req, res) => {
	const { id } = req.params;
	const estate = await Estate.findByPk(id);

	if (!estate) {
		return res.redirect('/my-real-estates');
	}
	
	if (estate.userId.toString() !== req.user.id.toString()) {
		return res.redirect('/my-real-estates');
	}

	const [categories, prices] = await Promise.all([
		Category.findAll(),
		Price.findAll()
	]);

	res.render('estate/edit', {
		page: `Editar propiedad: ${estate.title}`,
		csrfToken: req.csrfToken(),
		categories,
		prices,
		data: estate
	});
};

export const saveChanges = async (req, res) => {
	// Validación
	let result = validationResult(req);

	if (!result.isEmpty()) {
		const [categories, prices] = await Promise.all([
			Category.findAll(),
			Price.findAll()
		]);

		return res.render('estate/edit', {
			page: `Editar propiedad: ${req.body.title}`,
			csrfToken: req.csrfToken(),
			categories,
			prices,
			errors: result.array(),
			data: req.body
		});
	}
	const { id } = req.params;
	const estate = await Estate.findByPk(id);

	if (!estate) {
		return res.redirect('/my-real-estates');
	}
	
	if (estate.userId.toString() !== req.user.id.toString()) {
		return res.redirect('/my-real-estates');
	}

	// Reescribir el objeto y actualizar
	const { title, description, category: categoryId, price: precioId, bedrooms, parking, wc, street, lat, lng } = req.body;
	
	try {
		estate.set({ title, description, category: categoryId, price: precioId, bedrooms, parking, wc, street, lat, lng });
		await estate.save();
		res.redirect('/my-real-estates');
	} catch (error) {
		console.log(error);
	}
};

export const deleteEstate = async (req, res) => {
	const { id } = req.params;
	const estate = await Estate.findByPk(id);

	if (!estate) {
		return res.redirect('/my-real-estates');
	}
	
	if (estate.userId.toString() !== req.user.id.toString()) {
		return res.redirect('/my-real-estates');
	}

	// Eliminar registro
	await unlink(`public/uploads/${estate.image}`);

	// Eliminar registro
	await estate.destroy();
	res.redirect('/my-real-estate');
};

export const showEstate = async (req, res) => {
	const { id } = req.params;
	const estate = await Estate.findByPk(id, {
		include: [
			{ model: Price, as: 'price' },
			{ model: Category, as: 'category' }
		]
	});
	
	if (!estate) {
		return res.redirect('/404');
	}
	
	res.render('estate/show', {
		estate,
		page: estate.title
	});
};
