import categories from "./categories.js";
import prices from "./prices.js";
import users from "./users.js"

import { Category, Price, User } from '../models/index.js';

import db from "../config/db.js";

const importData = async () => {
    try {
        // Autenticar
        await db.authenticate();
        
        // Generar las columnas
        await db.sync();
        
        // Insertar los datos 
        await Promise.all([
            Category.bulkCreate(categories), 
            Price.bulkCreate(prices),
            User.bulkCreate(users)
        ]);

        console.log('Datos importados correctamente')
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const clearDatabase = async () => {
    try {
        // await Promise.all([
        //     Category.destroy({ where: {}, truncate: true }),
        //     Price.destroy({ where: {}, truncate: true })
        // ]);
        await db.sync({ force: true });
        console.log('Datos eliminados correctamente');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

if(process.argv[2] === "-i") {
    importData();
}

if(process.argv[2] === "-c") {
    clearDatabase();
}
