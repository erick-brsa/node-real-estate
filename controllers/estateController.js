import { validationResult } from 'express-validator';
import { Price, Category } from '../models/index.js';

export const admin = (req, res) => {
    res.render('estate/admin'), {
        page: 'Mis propiedades',
        bar: true
    }
};

export const create = async (req, res) => {
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ]);

    res.render('estate/create', {
        page: 'Crear propiedad',
        bar: true,
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
            bar: true,
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        });
    }

    // Guardar registro
    const { title, description, category, price, bedrooms, parking, wc, street, lat, lng } = req.body;
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
            categoryId: category
        });
    } catch (error) {
        console.log(error);
    }
};
