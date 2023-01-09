import Category from "../models/Category.js";
import categories from "./categories.js";

import Price from  "../models/Price.js";
import prices from "./prices.js";

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
            Price.bulkCreate(prices)
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
        exit();
    } catch (error) {
        console.log();
        process.exit(1)
    }
}

if(process.argv[2] === "-i") {
    importData();
}

if(process.argv[2] === "-c") {
    clearDatabase();
}
