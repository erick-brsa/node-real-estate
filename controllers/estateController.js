import { validationResult } from 'express-validator';
import Price from "../models/Price.js";
import Category from "../models/Category.js";

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
        console.log(req.body)
        
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
};
