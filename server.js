import 'dotenv/config'; // Carga las variables del archivo .env

import express from 'express';
import { Pool } from 'pg';
import helloRoutes from './routes/helloRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(express.json());

// Routes
app.use('/api/hello', helloRoutes);

app.get('/api/status', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({
            status: 'success',
            message: 'Conexión a la DB exitosa',
            currentTime: result.rows[0].now
        });
    } catch (err) {
        console.error('Error al conectar con la base de datos:', err);
        res.status(500).json({
            status: 'error',
            message: 'Fallo la conexión a la DB',
            details: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
    console.log('Ruta de prueba de DB: /api/status');
});