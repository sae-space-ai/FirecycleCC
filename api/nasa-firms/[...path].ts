import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const path = req.query.path as string[];
    if (!path || path.length === 0) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }

    // Construir la URL de NASA FIRMS
    const apiUrl = `https://firms.modaps.eosdis.nasa.gov/api/${path.join('/')}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.text();
    
    // NASA FIRMS devuelve CSV, no JSON
    res.setHeader('Content-Type', 'text/csv');
    return res.status(response.status).send(data);
  } catch (error) {
    console.error('NASA FIRMS proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
