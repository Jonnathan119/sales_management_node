// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config(); // variables de entorno

const app = express();

// Middleware
app.use(express.json()); // Parseo de JSON
app.use(cors()); // Habilitar CORS
app.use(morgan('dev')); // Logger de solicitudes

const { router: authRoutes, verifyToken } = require('./routes/authRoutes'); 
const salesRoutes = require('./routes/salesRoutes');

app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/sales', verifyToken, salesRoutes); // Rutas de gestión de ventas protegidas con middleware de autenticación

// Conexión con la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Inicio del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
