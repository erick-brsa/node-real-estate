import { Sequelize } from 'sequelize';
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
        departments,
        csrfToken: req.csrfToken()
    });
};

export const categories = async (req, res) => {

    const { id } = req.params;

    const category = await Category.findByPk(id);

    if(!category) {
        return res.redirect('/404');
    }

    const properties = await Estate.findAll({ 
        where: { categoryId: id },
        include: [
            { model: Price, as: 'price' }
        ] 
    }); 

    res.render('category', {
        page: `${category.name}s en venta`,
        properties,
        csrfToken: req.csrfToken()
    });
};

export const search = async (req, res) => {

    const { term } = req.body;

    if(!term.trim()) {
        return res.redirect('back');
    } 

    const properties = await Estate.findAll({
        where: {
            title: {
                [Sequelize.Op.like]: '%' + term + '%'
            }
        },
        include: [
            { model: Price, as: 'price' }
        ]
    });

    res.render('search', {
        page: 'Resultados de búsqueda',
        csrfToken: req.csrfToken(),
        properties
    });
};

export const notfound = (req, res) => {
    res.render('404', {
        page: 'No encontrado',
        csrfToken: req.csrfToken()
    });
};
