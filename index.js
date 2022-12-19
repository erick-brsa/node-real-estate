import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import estateRoutes from './routes/estateRoutes.js';
import db from './config/db.js';

// Crear la app
const app = express();

// Middlewares

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));
// Habilitar Cookie Parser
app.use(cookieParser());
// Habilitar CSRF
app.use(csurf({ cookie: true }));
// Carpeta pública
app.use(express.static('public'));
// Routing
app.use('/auth', userRoutes);
app.use('/estate', estateRoutes);

// Conexión a la base de datos
try {
	await db.authenticate();
	db.sync();
	console.log('Conexión correcta a la base de datos');
} catch (error) {
	console.log(error);
}

// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Definir un ouerto y arrancar la aplicación
const port = process.env.BACKEND_PORT || 3000;

app.listen(port, () => {
	console.log(`El servidor está corriendo en el puerto: ${port}`);
});
