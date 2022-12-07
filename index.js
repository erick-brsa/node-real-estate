import express from 'express';
import userRoutes from './routes/userRoutes.js';
import db from './config/db.js';

// Crear la app
const app = express();

// Conexión a la base de datos
try {
	await db.authenticate();
	console.log('Conexión correcta a la base de datos')
} catch (error) {
	console.log(error)
}

// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta pública
app.use(express.static('public'));

// Routing
app.use('/auth', userRoutes);

// Definir un ouerto y arrancar la aplicación
const port = 3000;

app.listen(port, () => {
	console.log(`El servidor está corriendo en el puerto: ${port}`);
});
