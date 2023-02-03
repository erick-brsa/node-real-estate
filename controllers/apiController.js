import { Estate, Price, Category } from '../models/index.js';

export const properties = async (req, res) => {

    const estates = await Estate.findAll({
        include: [
            { model: Price, as: 'price' },
            { model: Category, as: 'category' }
        ]
    });

    res.json({ estates });
};