// Utilidad de diagnóstico para verificar el estado de las APIs
// Úsalo en la consola del navegador: window.diagnoseAPIs()

export function diagnoseAPIs() {
  console.log('🔍 === DIAGNÓSTICO DE APIs ===');
  console.log('');
  
  console.log('🌐 Entorno:');
  console.log('  - import.meta.env.DEV:', import.meta.env.DEV);
  console.log('  - import.meta.env.PROD:', import.meta.env.PROD);
  console.log('  - import.meta.env.MODE:', import.meta.env.MODE);
  console.log('');
  
  console.log('🔑 Variables de Entorno:');
  console.log('  - VITE_IPSTACK_API_KEY:', import.meta.env.VITE_IPSTACK_API_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('  - VITE_WEATHERSTACK_API_KEY:', import.meta.env.VITE_WEATHERSTACK_API_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('  - VITE_POSITIONSTACK_API_KEY:', import.meta.env.VITE_POSITIONSTACK_API_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('  - VITE_AVIATIONSTACK_API_KEY:', import.meta.env.VITE_AVIATIONSTACK_API_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('  - VITE_MEDIASTACK_API_KEY:', import.meta.env.VITE_MEDIASTACK_API_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('  - VITE_COUNTRYLAYER_API_KEY:', import.meta.env.VITE_COUNTRYLAYER_API_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('  - VITE_NASA_FIRMS_MAP_KEY:', import.meta.env.VITE_NASA_FIRMS_MAP_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('  - VITE_COPERNICUS_CLIENT_ID:', import.meta.env.VITE_COPERNICUS_CLIENT_ID ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('  - VITE_COPERNICUS_CLIENT_SECRET:', import.meta.env.VITE_COPERNICUS_CLIENT_SECRET ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('  - VITE_MAPBOX_ACCESS_TOKEN:', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('');
  
  console.log('📋 Instrucciones:');
  console.log('  1. Si ves "❌ NO CONFIGURADA", añade la variable en Vercel:');
  console.log('     - Ve a tu proyecto en Vercel');
  console.log('     - Settings → Environment Variables');
  console.log('     - Añade la variable y redespliega');
  console.log('');
  console.log('  2. Después de añadir variables, recarga la página');
  console.log('  3. Revisa la pestaña Network para ver las peticiones');
  console.log('');
  
  console.log('🔧 Prueba rápida de APIs:');
  console.log('  Ejecuta: await testAPIs()');
  console.log('');
  console.log('=== FIN DEL DIAGNÓSTICO ===');
}

export async function testAPIs() {
  console.log('🧪 === PROBANDO APIs ===');
  
  // Test IPStack
  if (import.meta.env.VITE_IPSTACK_API_KEY) {
    console.log('🌍 Probando IPStack...');
    try {
      const response = await fetch(`http://api.ipstack.com/check?access_key=${import.meta.env.VITE_IPSTACK_API_KEY}`);
      const data = await response.json();
      console.log('  ✅ IPStack funciona:', data.city, data.country_name);
    } catch (error) {
      console.error('  ❌ IPStack falló:', error);
    }
  } else {
    console.log('  ⚠️ IPStack: API key no configurada');
  }
  
  // Test WeatherStack
  if (import.meta.env.VITE_WEATHERSTACK_API_KEY) {
    console.log('🌤️ Probando WeatherStack...');
    try {
      const response = await fetch(`http://api.weatherstack.com/current?access_key=${import.meta.env.VITE_WEATHERSTACK_API_KEY}&query=Madrid`);
      const data = await response.json();
      if (data.current) {
        console.log('  ✅ WeatherStack funciona:', data.current.temperature + '°C');
      } else {
        console.error('  ❌ WeatherStack respondió con error:', data);
      }
    } catch (error) {
      console.error('  ❌ WeatherStack falló:', error);
    }
  } else {
    console.log('  ⚠️ WeatherStack: API key no configurada');
  }
  
  // Test NASA FIRMS
  if (import.meta.env.VITE_NASA_FIRMS_MAP_KEY) {
    console.log('🔥 Probando NASA FIRMS...');
    try {
      const response = await fetch(`https://firms.modaps.eosdis.nasa.gov/api/stats/key/${import.meta.env.VITE_NASA_FIRMS_MAP_KEY}/`);
      console.log('  ✅ NASA FIRMS responde:', response.status);
    } catch (error) {
      console.error('  ❌ NASA FIRMS falló:', error);
    }
  } else {
    console.log('  ⚠️ NASA FIRMS: API key no configurada');
  }
  
  console.log('=== FIN DE PRUEBAS ===');
}

// Hacer las funciones disponibles globalmente
if (typeof window !== 'undefined') {
  (window as any).diagnoseAPIs = diagnoseAPIs;
  (window as any).testAPIs = testAPIs;
}
