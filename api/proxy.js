// api/proxy.js - Proxy universal para evitar CORS en Vercel
// Uso: /api/proxy?target=https://api.example.com/endpoint?param=value

module.exports = async (req, res) => {
  // Solo permitir GET y POST
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { target } = req.query;

  // Validar que target existe
  if (!target || typeof target !== 'string') {
    return res.status(400).json({ 
      error: 'Missing target parameter',
      usage: '/api/proxy?target=https://api.example.com/endpoint'
    });
  }

  // Validar que sea una URL válida
  try {
    new URL(target);
  } catch (e) {
    return res.status(400).json({ 
      error: 'Invalid target URL',
      received: target
    });
  }

  // Lista blanca de dominios permitidos (seguridad)
  const allowedDomains = [
    'api.ipstack.com',
    'api.positionstack.com',
    'api.weatherstack.com',
    'api.aviationstack.com',
    'api.mediastack.com',
    'api.countrylayer.com',
    'firms.modaps.eosdis.nasa.gov',
    'sh.dataspace.copernicus.eu',
    'identity.dataspace.copernicus.eu',
  ];

  const targetUrl = new URL(target);
  if (!allowedDomains.includes(targetUrl.hostname)) {
    return res.status(403).json({ 
      error: 'Domain not allowed',
      domain: targetUrl.hostname,
      allowed: allowedDomains
    });
  }

  try {
    // Construir headers para la petición
    const headers = {
      'Content-Type': req.headers['content-type'] || 'application/json',
    };

    // Copiar Authorization header si existe
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    // Configurar opciones de fetch
    const fetchOptions = {
      method: req.method,
      headers,
    };

    // Añadir body si es POST
    if (req.method === 'POST' && req.body) {
      if (typeof req.body === 'string') {
        fetchOptions.body = req.body;
      } else {
        fetchOptions.body = JSON.stringify(req.body);
      }
    }

    // Hacer la petición a la API destino
    const response = await fetch(target, fetchOptions);

    // Obtener el contenido
    const contentType = response.headers.get('content-type') || '';
    
    // Copiar headers importantes
    if (contentType.includes('image/')) {
      res.setHeader('Content-Type', contentType);
      const buffer = await response.arrayBuffer();
      return res.status(response.status).send(Buffer.from(buffer));
    }

    if (contentType.includes('text/csv')) {
      res.setHeader('Content-Type', 'text/csv');
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    // Por defecto, asumir JSON
    const data = await response.json();
    
    // Añadir headers CORS para el frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      target: target
    });
  }
};
