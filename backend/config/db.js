import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Crear el "Pool" de conexiones a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yacuiba_entregas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Comprobar la conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión a la base de datos MySQL establecida correctamente.');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a la base de datos:', err.message);
  });

export default pool;
