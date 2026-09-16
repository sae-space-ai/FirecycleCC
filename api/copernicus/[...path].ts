import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const path = req.query.path as string[];
    if (!path || path.length === 0) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }

    // Construir la URL de Sentinel Hub
    const apiUrl = `https://sh.dataspace.copernicus.eu/api/v1/${path.join('/')}`;
    
    // Obtener el token de autorización del header
    const authHeader = req.headers.authorization;
    
    const fetchOptions: RequestInit = {
      method: req.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    };

    // Si es POST, añadir el body
    if (req.method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(apiUrl, fetchOptions);
    
    const contentType = response.headers.get('content-type');
    
    // Si es una imagen, devolverla como tal
    if (contentType && contentType.startsWith('image/')) {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      return res.status(response.status).send(Buffer.from(buffer));
    }
    
    // Si es JSON, parsearlo
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Copernicus proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
