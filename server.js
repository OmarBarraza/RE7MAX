// server.js - Servidor proxy simple para RE/MAX
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Habilitar CORS para todas las peticiones
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML)
app.use(express.static(__dirname));

// Proxy para todas las propiedades
app.get('/api/propiedades', async (req, res) => {
    try {
        const response = await axios.get('https://remax.com.mx/ajax/FetchDatosDataNew', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Referer': 'https://remax.com.mx/'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error al obtener propiedades' });
    }
});

// Proxy para propiedad específica
app.get('/api/propiedad/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://remax.com.mx/ajax/FetchPropiedadFlyerData/${id}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Referer': 'https://remax.com.mx/'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error al obtener propiedad' });
    }
});

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   ✅ Servidor corriendo en: http://localhost:${PORT}     ║
║                                                       ║
║   📂 Abre: http://localhost:${PORT}    ║
║                                                       ║
║   🔧 Proxy activo - Sin problemas de CORS            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
});