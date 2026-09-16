import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Solo permitir GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint, ...queryParams } = req.query;
    
    if (!endpoint || typeof endpoint !== 'string') {
      return res.status(400).json({ error: 'Endpoint parameter is required' });
    }

    // Construir la URL de APILayer
    const apiUrl = `https://api.${endpoint}.com/${req.url?.split('?')[1] || ''}`;
    
    // Hacer la petición a APILayer
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    // Retornar la respuesta
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('APILayer proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
