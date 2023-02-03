import { Price, Category, Estate } from '../models/index.js';

export const home = async (req, res) => {
    
    const [categories, prices, houses, departments] = await Promise.all([
        Category.findAll({ raw: true }),
        Price.findAll({ raw: true }),
        Estate.findAll({
            limit: 3,
            where: { categoryId: 1 },
            include: [ { model: Price, as: 'price' }],
            order: [['createdAt', 'DESC']]
        }),
        Estate.findAll({
            limit: 3,
            where: { categoryId: 2 },
            include: [ { model: Price, as: 'price' }],
            order: [['createdAt', 'DESC']]
        }),
    ]);

    console.log(houses, departments)

    res.render('home', {
        page: 'Inicio',
        categories,
        prices,
        houses, 
        departments
    });
};

export const categories = async (req, res) => {
    res.render('', {
        page: `Categoria ${''}`,
    });
};

export const search = (req, res) => {
    res.render('', {
        page: 'Resultados',
    });
};

export const notfound = (req, res) => {
    res.render('', {
        page: 'No encontrado',
    });
};
