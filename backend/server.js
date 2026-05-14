import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde React (Vite)
app.use(express.json()); // Permite recibir datos en formato JSON

// Ruta básica de prueba
app.get('/api/status', (req, res) => {
  res.json({ message: 'El backend está funcionando correctamente 🚀' });
});

// Ruta para obtener todos los productos desde MySQL
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Ruta para obtener todos los usuarios (Solo como ejemplo, en producción debe estar protegida)
app.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, apellidos, email, telefono, estado FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// --- CONFIGURACIÓN PARA PRODUCCIÓN ---
// Servir archivos estáticos de la carpeta "dist" (donde Vite construye el proyecto)
app.use(express.static(path.join(__dirname, '../dist')));

// Cualquier ruta que no sea de la API, redirigirla al index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
