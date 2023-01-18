import { validationResult } from 'express-validator';
import { Price, Category, Estate } from '../models/index.js';

export const admin = (req, res) => {
    res.render('estate/admin'), {
        page: 'Mis propiedades'
    }
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

export const save = async (req,res) => {
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
            title, 
            description, 
            bedrooms, 
            parking, 
            wc, 
            street, 
            lat, 
            lng,
            priceId: price,
            categoryId: category,
            userId,
            image: ''
        });
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
    if (estate.id.toString() !== req.user.id.toString()) {
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
