require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const productosRoutes = require('./routes/productos');
const pedidosRoutes = require('./routes/pedidos');
const authRoutes = require('./routes/auth');
const uploadsRoutes = require('./routes/uploads');

const app = express();
app.use(cors({
  origin: ['https://food-project-plum.vercel.app', 'http://localhost:5173']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadsRoutes);

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});