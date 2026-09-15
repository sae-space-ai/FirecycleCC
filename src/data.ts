export interface FireIncident {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  acres: number;
  containment: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  startedAt: string;
  cause: string;
  status: string;
  crews: number;
  engines: number;
  aircraft: number;
}

export interface Resource {
  id: string;
  type: 'crew' | 'engine' | 'aircraft' | 'helicopter';
  name: string;
  status: 'deployed' | 'standby' | 'maintenance' | 'transit';
  assignedTo: string | null;
  personnel: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  fireId?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  fireRisk: 'extreme' | 'very-high' | 'high' | 'moderate' | 'low';
  condition: string;
}

export interface SatelliteData {
  id: string;
  name: string;
  type: 'thermal' | 'optical' | 'sar' | 'multispectral';
  provider: string;
  lastPass: string;
  nextPass: string;
  resolution: string;
  coverage: number;
  hotspots: number;
  fireId?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface GeospatialLayer {
  id: string;
  name: string;
  type: 'topography' | 'vegetation' | 'fuel-load' | 'wind-pattern' | 'evacuation-route' | 'water-source';
  active: boolean;
  opacity: number;
  lastUpdated: string;
  dataPoints: number;
}

export interface VerifiedNode {
  id: string;
  type: 'weather-station' | 'iot-sensor' | 'camera' | 'drone' | 'ground-crew' | 'satellite-uplink';
  name: string;
  lat: number;
  lng: number;
  status: 'online' | 'offline' | 'warning' | 'critical';
  lastReading: string;
  fireId?: string;
  verified: boolean;
  dataStream: string;
}

export const fireIncidents: FireIncident[] = [
  {
    id: 'FIRE-001',
    name: 'Incendio Sierra de Las Hurdes',
    location: 'Sierra de Las Hurdes, Cáceres',
    lat: 40.36,
    lng: -6.23,
    acres: 420,
    containment: 35,
    severity: 'critical',
    startedAt: '2026-06-14T08:30:00Z',
    cause: 'Rayo',
    status: 'Activo - Supresión Total',
    crews: 12,
    engines: 8,
    aircraft: 3,
  },
  {
    id: 'FIRE-002',
    name: 'Incendio Caminomorisco',
    location: 'Caminomorisco, Cáceres',
    lat: 40.38,
    lng: -6.22,
    acres: 185,
    containment: 60,
    severity: 'high',
    startedAt: '2026-06-15T14:15:00Z',
    cause: 'Humano',
    status: 'Activo - Contención',
    crews: 6,
    engines: 4,
    aircraft: 1,
  },
  {
    id: 'FIRE-003',
    name: 'Incendio Pinofranqueado',
    location: 'Pinofranqueado, Cáceres',
    lat: 40.28,
    lng: -6.25,
    acres: 89,
    containment: 75,
    severity: 'medium',
    startedAt: '2026-06-13T11:00:00Z',
    cause: 'Quema agrícola',
    status: 'Activo - Remate',
    crews: 3,
    engines: 2,
    aircraft: 0,
  },
  {
    id: 'FIRE-004',
    name: 'Incendio Nuñomoral',
    location: 'Nuñomoral, Cáceres',
    lat: 40.36,
    lng: -6.28,
    acres: 310,
    containment: 20,
    severity: 'critical',
    startedAt: '2026-06-16T06:45:00Z',
    cause: 'Rayo',
    status: 'Activo - Supresión Total',
    crews: 15,
    engines: 10,
    aircraft: 4,
  },
  {
    id: 'FIRE-005',
    name: 'Incendio Casares',
    location: 'Casares de las Hurdes, Cáceres',
    lat: 40.32,
    lng: -6.32,
    acres: 45,
    containment: 90,
    severity: 'low',
    startedAt: '2026-06-12T09:20:00Z',
    cause: 'Fogata',
    status: 'Activo - Monitoreo',
    crews: 2,
    engines: 1,
    aircraft: 0,
  },
  {
    id: 'FIRE-006',
    name: 'Incendio Ladrillar',
    location: 'Ladrillar, Cáceres',
    lat: 40.30,
    lng: -6.35,
    acres: 220,
    containment: 45,
    severity: 'high',
    startedAt: '2026-06-15T16:30:00Z',
    cause: 'Línea eléctrica',
    status: 'Activo - Contención',
    crews: 8,
    engines: 6,
    aircraft: 2,
  },
];

export const resources: Resource[] = [
  { id: 'R-001', type: 'crew', name: 'Brigada Helitransportada Alpha', status: 'deployed', assignedTo: 'FIRE-001', personnel: 20 },
  { id: 'R-002', type: 'crew', name: 'Brigada Helitransportada Bravo', status: 'deployed', assignedTo: 'FIRE-004', personnel: 20 },
  { id: 'R-003', type: 'crew', name: 'Cuadrilla de Tierra 7', status: 'deployed', assignedTo: 'FIRE-002', personnel: 12 },
  { id: 'R-004', type: 'crew', name: 'Cuadrilla de Tierra 12', status: 'standby', assignedTo: null, personnel: 12 },
  { id: 'R-005', type: 'engine', name: 'Autobomba 301', status: 'deployed', assignedTo: 'FIRE-001', personnel: 4 },
  { id: 'R-006', type: 'engine', name: 'Autobomba 302', status: 'deployed', assignedTo: 'FIRE-004', personnel: 4 },
  { id: 'R-007', type: 'engine', name: 'Autobomba 303', status: 'maintenance', assignedTo: null, personnel: 0 },
  { id: 'R-008', type: 'engine', name: 'Autobomba 304', status: 'transit', assignedTo: 'FIRE-006', personnel: 4 },
  { id: 'R-009', type: 'aircraft', name: 'Avión de Carga 14', status: 'deployed', assignedTo: 'FIRE-004', personnel: 3 },
  { id: 'R-010', type: 'aircraft', name: 'Avión de Carga 22', status: 'standby', assignedTo: null, personnel: 3 },
  { id: 'R-011', type: 'helicopter', name: 'Helicóptero H-1', status: 'deployed', assignedTo: 'FIRE-001', personnel: 4 },
  { id: 'R-012', type: 'helicopter', name: 'Helicóptero H-2', status: 'deployed', assignedTo: 'FIRE-004', personnel: 4 },
  { id: 'R-013', type: 'crew', name: 'Unidad de Paracaidistas 3', status: 'standby', assignedTo: null, personnel: 16 },
  { id: 'R-014', type: 'engine', name: 'Cisterna 5', status: 'deployed', assignedTo: 'FIRE-002', personnel: 2 },
  { id: 'R-015', type: 'crew', name: 'Equipo de Maquinaria 2', status: 'deployed', assignedTo: 'FIRE-006', personnel: 6 },
];

export const alerts: Alert[] = [
  { id: 'A-001', type: 'critical', message: 'Incendio Sierra de Las Hurdes ha expandido 40 hectáreas en la última hora. Se espera cambio de viento.', timestamp: '2026-06-16T18:45:00Z', fireId: 'FIRE-001' },
  { id: 'A-002', type: 'critical', message: 'Incendio Nuñomoral amenaza zona residencial. Órdenes de evacuación emitidas.', timestamp: '2026-06-16T18:30:00Z', fireId: 'FIRE-004' },
  { id: 'A-003', type: 'warning', message: 'Alerta de riesgo extremo de incendio activa para Las Hurdes hasta mañana.', timestamp: '2026-06-16T18:00:00Z' },
  { id: 'A-004', type: 'warning', message: 'Vehículo autobomba 303 en mantenimiento. Tiempo estimado de retorno: 4 horas.', timestamp: '2026-06-16T17:30:00Z' },
  { id: 'A-005', type: 'info', message: 'Recursos adicionales solicitados para incendio de Caminomorisco.', timestamp: '2026-06-16T17:15:00Z', fireId: 'FIRE-002' },
  { id: 'A-006', type: 'info', message: 'Incendio de Casares al 90% de control. Se espera control total al final del día.', timestamp: '2026-06-16T16:45:00Z', fireId: 'FIRE-005' },
  { id: 'A-007', type: 'warning', message: 'Visibilidad reducida por humo en EX-204 cerca de Sierra de Las Hurdes.', timestamp: '2026-06-16T16:30:00Z', fireId: 'FIRE-001' },
];

export const weatherData: WeatherData = {
  temperature: 34,
  humidity: 12,
  windSpeed: 28,
  windDirection: 'SO',
  fireRisk: 'extreme',
  condition: 'Despejado y Seco',
};

export const stats = {
  activeFires: 6,
  totalAcres: 12690,
  personnelDeployed: 153,
  resourcesDeployed: 11,
  avgContainment: 54,
  evacuations: 2,
};

export const satelliteData: SatelliteData[] = [
  {
    id: 'SAT-001',
    name: 'GOES-18 West',
    type: 'thermal',
    provider: 'NOAA',
    lastPass: '2026-06-16T18:30:00Z',
    nextPass: '2026-06-16T18:45:00Z',
    resolution: '2km',
    coverage: 98,
    hotspots: 12,
    fireId: 'FIRE-001',
    confidence: 'high',
  },
  {
    id: 'SAT-002',
    name: 'Sentinel-2A',
    type: 'multispectral',
    provider: 'ESA Copernicus',
    lastPass: '2026-06-16T10:15:00Z',
    nextPass: '2026-06-17T10:15:00Z',
    resolution: '10m',
    coverage: 85,
    hotspots: 8,
    fireId: 'FIRE-004',
    confidence: 'high',
  },
  {
    id: 'SAT-003',
    name: 'Landsat-9',
    type: 'optical',
    provider: 'USGS/NASA',
    lastPass: '2026-06-15T18:45:00Z',
    nextPass: '2026-06-17T18:45:00Z',
    resolution: '30m',
    coverage: 72,
    hotspots: 5,
    fireId: 'FIRE-002',
    confidence: 'medium',
  },
  {
    id: 'SAT-004',
    name: 'VIIRS SNPP',
    type: 'thermal',
    provider: 'NASA/NOAA',
    lastPass: '2026-06-16T14:20:00Z',
    nextPass: '2026-06-16T20:35:00Z',
    resolution: '375m',
    coverage: 95,
    hotspots: 15,
    fireId: 'FIRE-001',
    confidence: 'high',
  },
  {
    id: 'SAT-005',
    name: 'Sentinel-1 SAR',
    type: 'sar',
    provider: 'ESA Copernicus',
    lastPass: '2026-06-16T06:30:00Z',
    nextPass: '2026-06-18T06:30:00Z',
    resolution: '5m',
    coverage: 68,
    hotspots: 0,
    confidence: 'medium',
  },
  {
    id: 'SAT-006',
    name: 'MODIS Terra',
    type: 'thermal',
    provider: 'NASA',
    lastPass: '2026-06-16T12:10:00Z',
    nextPass: '2026-06-17T01:30:00Z',
    resolution: '1km',
    coverage: 92,
    hotspots: 9,
    fireId: 'FIRE-006',
    confidence: 'medium',
  },
];

export const geospatialLayers: GeospatialLayer[] = [
  {
    id: 'GEO-001',
    name: 'Topography (DEM)',
    type: 'topography',
    active: true,
    opacity: 0.6,
    lastUpdated: '2026-06-16T12:00:00Z',
    dataPoints: 1250000,
  },
  {
    id: 'GEO-002',
    name: 'Vegetation Index (NDVI)',
    type: 'vegetation',
    active: true,
    opacity: 0.7,
    lastUpdated: '2026-06-16T10:15:00Z',
    dataPoints: 850000,
  },
  {
    id: 'GEO-003',
    name: 'Fuel Load Model',
    type: 'fuel-load',
    active: true,
    opacity: 0.5,
    lastUpdated: '2026-06-15T18:00:00Z',
    dataPoints: 420000,
  },
  {
    id: 'GEO-004',
    name: 'Wind Patterns',
    type: 'wind-pattern',
    active: true,
    opacity: 0.4,
    lastUpdated: '2026-06-16T18:00:00Z',
    dataPoints: 35000,
  },
  {
    id: 'GEO-005',
    name: 'Evacuation Routes',
    type: 'evacuation-route',
    active: true,
    opacity: 0.8,
    lastUpdated: '2026-06-16T14:30:00Z',
    dataPoints: 1250,
  },
  {
    id: 'GEO-006',
    name: 'Water Sources',
    type: 'water-source',
    active: false,
    opacity: 0.6,
    lastUpdated: '2026-06-14T08:00:00Z',
    dataPoints: 8500,
  },
];

export interface Territory {
  id: string;
  name: string;
  type: 'city' | 'park' | 'forest' | 'mountain' | 'river' | 'highway' | 'region';
  lat: number;
  lng: number;
  state: string;
  population?: number;
  description?: string;
}

export const territories: Territory[] = [
  // Las Hurdes - Comarca principal
  { id: 'TER-001', name: 'Las Hurdes', type: 'region', lat: 40.35, lng: -6.25, state: 'Cáceres', description: 'Comarca natural de Extremadura, España' },
  
  // Municipios de Las Hurdes
  { id: 'TER-002', name: 'Caminomorisco', type: 'city', lat: 40.38, lng: -6.22, state: 'Cáceres', population: 1200, description: 'Capital de Las Hurdes' },
  { id: 'TER-003', name: 'Nuñomoral', type: 'city', lat: 40.36, lng: -6.28, state: 'Cáceres', population: 1500, description: 'Municipio hurdano' },
  { id: 'TER-004', name: 'Pinofranqueado', type: 'city', lat: 40.28, lng: -6.25, state: 'Cáceres', population: 2100, description: 'Conocido por sus cerezos' },
  { id: 'TER-005', name: 'Casares de las Hurdes', type: 'city', lat: 40.32, lng: -6.32, state: 'Cáceres', population: 450, description: 'Pueblo tradicional hurdano' },
  { id: 'TER-006', name: 'Ladrillar', type: 'city', lat: 40.30, lng: -6.35, state: 'Cáceres', population: 200, description: 'Municipio más pequeño' },
  { id: 'TER-007', name: 'Riomalo de Abajo', type: 'city', lat: 40.34, lng: -6.20, state: 'Cáceres', population: 180, description: 'Aldea hurdana' },
  { id: 'TER-008', name: 'Azabache', type: 'city', lat: 40.37, lng: -6.24, state: 'Cáceres', population: 250, description: 'Famoso por el azabache' },
  
  // Ríos de Las Hurdes
  { id: 'TER-009', name: 'Río Los Ángeles', type: 'river', lat: 40.35, lng: -6.26, state: 'Cáceres', description: 'Principal río de Las Hurdes' },
  { id: 'TER-010', name: 'Río Hurdano', type: 'river', lat: 40.33, lng: -6.27, state: 'Cáceres', description: 'Afluente del Árrago' },
  { id: 'TER-011', name: 'Río Árrago', type: 'river', lat: 40.30, lng: -6.30, state: 'Cáceres', description: 'Río principal de la comarca' },
  
  // Montañas y sierras
  { id: 'TER-012', name: 'Sierra de Las Hurdes', type: 'mountain', lat: 40.36, lng: -6.23, state: 'Cáceres', description: 'Sierra principal de la comarca' },
  { id: 'TER-013', name: 'Pino de la Barrueca', type: 'mountain', lat: 40.34, lng: -6.25, state: 'Cáceres', description: 'Punto más alto, 1286m' },
  { id: 'TER-014', name: 'La Canaleja', type: 'mountain', lat: 40.37, lng: -6.21, state: 'Cáceres', description: 'Mirador natural' },
  
  // Bosques y áreas naturales
  { id: 'TER-015', name: 'Bosque de Las Hurdes', type: 'forest', lat: 40.35, lng: -6.24, state: 'Cáceres', description: 'Bosque de robles y castaños' },
  { id: 'TER-016', name: 'Valle del Jerte', type: 'region', lat: 40.20, lng: -6.00, state: 'Cáceres', description: 'Famoso por los cerezos en flor' },
  { id: 'TER-017', name: 'Sierra de Gata', type: 'region', lat: 40.25, lng: -6.50, state: 'Cáceres', description: 'Comarca vecina al oeste' },
  
  // Ciudades cercanas
  { id: 'TER-018', name: 'Plasencia', type: 'city', lat: 40.03, lng: -6.09, state: 'Cáceres', population: 41000, description: 'Ciudad más cercana importante' },
  { id: 'TER-019', name: 'Coria', type: 'city', lat: 39.95, lng: -6.55, state: 'Cáceres', population: 13000, description: 'Ciudad histórica' },
  { id: 'TER-020', name: 'Cáceres', type: 'city', lat: 39.47, lng: -6.37, state: 'Cáceres', population: 96000, description: 'Capital de provincia' },
  { id: 'TER-021', name: 'Salamanca', type: 'city', lat: 40.96, lng: -5.66, state: 'Salamanca', population: 144000, description: 'Ciudad universitaria' },
  
  // Carreteras
  { id: 'TER-022', name: 'EX-204', type: 'highway', lat: 40.35, lng: -6.25, state: 'Cáceres', description: 'Carretera principal de Las Hurdes' },
  { id: 'TER-023', name: 'CC-17', type: 'highway', lat: 40.30, lng: -6.30, state: 'Cáceres', description: 'Carretera comarcal' },
  
  // Puntos de interés
  { id: 'TER-024', name: 'Chorro de la Meancera', type: 'park', lat: 40.36, lng: -6.23, state: 'Cáceres', description: 'Cascada espectacular' },
  { id: 'TER-025', name: 'Piscinas Naturales de Pinofranqueado', type: 'park', lat: 40.28, lng: -6.25, state: 'Cáceres', description: 'Zona de baño natural' },
];

export const verifiedNodes: VerifiedNode[] = [
  {
    id: 'NODE-001',
    type: 'weather-station',
    name: 'Estación Meteorológica Caminomorisco',
    lat: 40.38,
    lng: -6.22,
    status: 'online',
    lastReading: '2026-06-16T18:40:00Z',
    fireId: 'FIRE-001',
    verified: true,
    dataStream: 'temp,humidity,wind,pressure',
  },
  {
    id: 'NODE-002',
    type: 'iot-sensor',
    name: 'Sensor Térmico Sierra de Las Hurdes',
    lat: 40.36,
    lng: -6.23,
    status: 'online',
    lastReading: '2026-06-16T18:42:00Z',
    fireId: 'FIRE-001',
    verified: true,
    dataStream: 'temperature,smoke,co2',
  },
  {
    id: 'NODE-003',
    type: 'camera',
    name: 'Cámara Vigilancia Nuñomoral',
    lat: 40.36,
    lng: -6.28,
    status: 'online',
    lastReading: '2026-06-16T18:44:00Z',
    fireId: 'FIRE-004',
    verified: true,
    dataStream: 'video,thermal-imaging',
  },
  {
    id: 'NODE-004',
    type: 'drone',
    name: 'UAV Reconocimiento Hurdes',
    lat: 40.35,
    lng: -6.25,
    status: 'online',
    lastReading: '2026-06-16T18:35:00Z',
    fireId: 'FIRE-001',
    verified: true,
    dataStream: 'video,lidar,thermal',
  },
  {
    id: 'NODE-005',
    type: 'ground-crew',
    name: 'Brigada Terrestre GT-12',
    lat: 40.37,
    lng: -6.24,
    status: 'online',
    lastReading: '2026-06-16T18:38:00Z',
    fireId: 'FIRE-002',
    verified: true,
    dataStream: 'gps,status,observations',
  },
  {
    id: 'NODE-006',
    type: 'satellite-uplink',
    name: 'Enlace Satelital Las Hurdes',
    lat: 40.34,
    lng: -6.26,
    status: 'warning',
    lastReading: '2026-06-16T18:30:00Z',
    fireId: 'FIRE-006',
    verified: true,
    dataStream: 'satellite-data,relay',
  },
  {
    id: 'NODE-007',
    type: 'weather-station',
    name: 'Estación Pinofranqueado',
    lat: 40.28,
    lng: -6.25,
    status: 'online',
    lastReading: '2026-06-16T18:41:00Z',
    fireId: 'FIRE-003',
    verified: true,
    dataStream: 'temp,humidity,wind,rain',
  },
  {
    id: 'NODE-008',
    type: 'iot-sensor',
    name: 'Monitor Calidad del Aire Casares',
    lat: 40.32,
    lng: -6.32,
    status: 'offline',
    lastReading: '2026-06-16T16:20:00Z',
    fireId: 'FIRE-005',
    verified: true,
    dataStream: 'pm2.5,pm10,co,o3',
  },
  {
    id: 'NODE-009',
    type: 'camera',
    name: 'Cámara Panorámica Ladrillar',
    lat: 40.30,
    lng: -6.35,
    status: 'online',
    lastReading: '2026-06-16T18:43:00Z',
    fireId: 'FIRE-006',
    verified: true,
    dataStream: 'video,360-panorama',
  },
  {
    id: 'NODE-010',
    type: 'drone',
    name: 'UAV Cartografía Azabache',
    lat: 40.37,
    lng: -6.24,
    status: 'online',
    lastReading: '2026-06-16T18:36:00Z',
    fireId: 'FIRE-002',
    verified: true,
    dataStream: 'video,photogrammetry',
  },
  {
    id: 'NODE-011',
    type: 'ground-crew',
    name: 'Equipo Reconocimiento RT-08',
    lat: 40.31,
    lng: -6.34,
    status: 'online',
    lastReading: '2026-06-16T18:39:00Z',
    fireId: 'FIRE-006',
    verified: true,
    dataStream: 'gps,photos,assessments',
  },
  {
    id: 'NODE-012',
    type: 'iot-sensor',
    name: 'Sensor Humedad Combustible',
    lat: 40.35,
    lng: -6.24,
    status: 'online',
    lastReading: '2026-06-16T18:40:00Z',
    fireId: 'FIRE-001',
    verified: true,
    dataStream: 'fuel-moisture,soil-temp',
  },
];
