const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Servidor proxy funcionando');
});

app.get('/api/property/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const response = await fetch(
            `https://remax.com.mx/ajax/FetchPropiedadFlyerData/${id}`
        );

        if (!response.ok) {
            return res.status(500).json({
                error: 'Error en API externa'
            });
        }

        const data = await response.json();

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error interno'
        });

    }

});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});