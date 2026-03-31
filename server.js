// ============================================================
//  RE/MAX Victoria — Proxy Server
//  Node.js + Express
//
//  Instalación:
//    npm install express node-fetch cors
//
//  Uso:
//    node server.js
//
//  Endpoints disponibles:
//    GET /api/propiedad/:id   → FetchPropiedadFlyerData/:id
//    GET /api/filtros         → FetchDatosDataNew
// ============================================================

const express  = require('express');
const cors     = require('cors');

const app = express();
const PORT = 3000;

const REMAX_BASE = 'https://remax.com.mx/ajax';

// ── Headers que simulan un navegador real ────────────────────
const BROWSER_HEADERS = {
    'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept':          'application/json, text/plain, */*',
    'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
    'Referer':         'https://remax.com.mx/',
    'Origin':          'https://remax.com.mx',
};

// ── CORS: permite peticiones desde file:// y localhost ───────
app.use(cors({
    origin: (origin, cb) => cb(null, true), // acepta cualquier origen
    methods: ['GET'],
}));

// ── GET /api/propiedad/:id ───────────────────────────────────
app.get('/api/propiedad/:id', async (req, res) => {
    const { id } = req.params;

    if (!id || !/^\d+$/.test(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const url = `${REMAX_BASE}/FetchPropiedadFlyerData/${id}`;
    console.log(`[proxy] GET ${url}`);

    try {
        // Node 18+ tiene fetch nativo; versiones anteriores usan node-fetch
        const fetcher = globalThis.fetch ?? require('node-fetch');
        const upstream = await fetcher(url, { headers: BROWSER_HEADERS });

        if (!upstream.ok) {
            return res.status(upstream.status).json({
                error: `remax.com.mx respondió ${upstream.status}`
            });
        }

        const data = await upstream.json();
        res.json(data);

    } catch (err) {
        console.error('[proxy] Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/filtros ─────────────────────────────────────────
app.get('/api/filtros', async (req, res) => {
    const url = `${REMAX_BASE}/FetchDatosDataNew`;
    console.log(`[proxy] GET ${url}`);

    try {
        const fetcher = globalThis.fetch ?? require('node-fetch');
        const upstream = await fetcher(url, { headers: BROWSER_HEADERS });
        const data = await upstream.json();
        res.json(data);
    } catch (err) {
        console.error('[proxy] Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ── Inicio ───────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Proxy corriendo en http://localhost:${PORT}`);
    console.log(`   Prueba: http://localhost:${PORT}/api/propiedad/666990`);
});
