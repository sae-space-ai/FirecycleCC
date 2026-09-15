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
    name: 'Sierra Blaze',
    location: 'Sierra Nevada, CA',
    lat: 37.8,
    lng: -119.5,
    acres: 4200,
    containment: 35,
    severity: 'critical',
    startedAt: '2026-06-14T08:30:00Z',
    cause: 'Lightning',
    status: 'Active - Full Suppression',
    crews: 12,
    engines: 8,
    aircraft: 3,
  },
  {
    id: 'FIRE-002',
    name: 'Eagle Ridge Fire',
    location: 'Eagle Ridge, OR',
    lat: 43.2,
    lng: -122.1,
    acres: 1850,
    containment: 60,
    severity: 'high',
    startedAt: '2026-06-15T14:15:00Z',
    cause: 'Human',
    status: 'Active - Containment',
    crews: 6,
    engines: 4,
    aircraft: 1,
  },
  {
    id: 'FIRE-003',
    name: 'Pine Valley Fire',
    location: 'Pine Valley, NV',
    lat: 38.9,
    lng: -115.3,
    acres: 890,
    containment: 75,
    severity: 'medium',
    startedAt: '2026-06-13T11:00:00Z',
    cause: 'Debris Burn',
    status: 'Active - Mop Up',
    crews: 3,
    engines: 2,
    aircraft: 0,
  },
  {
    id: 'FIRE-004',
    name: 'Thunder Peak',
    location: 'Thunder Peak, WA',
    lat: 47.5,
    lng: -121.2,
    acres: 3100,
    containment: 20,
    severity: 'critical',
    startedAt: '2026-06-16T06:45:00Z',
    cause: 'Lightning',
    status: 'Active - Full Suppression',
    crews: 15,
    engines: 10,
    aircraft: 4,
  },
  {
    id: 'FIRE-005',
    name: 'Canyon Rim Fire',
    location: 'Canyon Rim, AZ',
    lat: 35.2,
    lng: -111.7,
    acres: 450,
    containment: 90,
    severity: 'low',
    startedAt: '2026-06-12T09:20:00Z',
    cause: 'Campfire',
    status: 'Active - Monitor',
    crews: 2,
    engines: 1,
    aircraft: 0,
  },
  {
    id: 'FIRE-006',
    name: 'Redwood Flats',
    location: 'Redwood County, CA',
    lat: 40.5,
    lng: -123.8,
    acres: 2200,
    containment: 45,
    severity: 'high',
    startedAt: '2026-06-15T16:30:00Z',
    cause: 'Power Line',
    status: 'Active - Containment',
    crews: 8,
    engines: 6,
    aircraft: 2,
  },
];

export const resources: Resource[] = [
  { id: 'R-001', type: 'crew', name: 'Hotshot Team Alpha', status: 'deployed', assignedTo: 'FIRE-001', personnel: 20 },
  { id: 'R-002', type: 'crew', name: 'Hotshot Team Bravo', status: 'deployed', assignedTo: 'FIRE-004', personnel: 20 },
  { id: 'R-003', type: 'crew', name: 'Engine Crew 7', status: 'deployed', assignedTo: 'FIRE-002', personnel: 12 },
  { id: 'R-004', type: 'crew', name: 'Engine Crew 12', status: 'standby', assignedTo: null, personnel: 12 },
  { id: 'R-005', type: 'engine', name: 'Engine 301', status: 'deployed', assignedTo: 'FIRE-001', personnel: 4 },
  { id: 'R-006', type: 'engine', name: 'Engine 302', status: 'deployed', assignedTo: 'FIRE-004', personnel: 4 },
  { id: 'R-007', type: 'engine', name: 'Engine 303', status: 'maintenance', assignedTo: null, personnel: 0 },
  { id: 'R-008', type: 'engine', name: 'Engine 304', status: 'transit', assignedTo: 'FIRE-006', personnel: 4 },
  { id: 'R-009', type: 'aircraft', name: 'Air Tanker 14', status: 'deployed', assignedTo: 'FIRE-004', personnel: 3 },
  { id: 'R-010', type: 'aircraft', name: 'Air Tanker 22', status: 'standby', assignedTo: null, personnel: 3 },
  { id: 'R-011', type: 'helicopter', name: 'Helitack H-1', status: 'deployed', assignedTo: 'FIRE-001', personnel: 4 },
  { id: 'R-012', type: 'helicopter', name: 'Helitack H-2', status: 'deployed', assignedTo: 'FIRE-004', personnel: 4 },
  { id: 'R-013', type: 'crew', name: 'Smokejumper Unit 3', status: 'standby', assignedTo: null, personnel: 16 },
  { id: 'R-014', type: 'engine', name: 'Water Tender 5', status: 'deployed', assignedTo: 'FIRE-002', personnel: 2 },
  { id: 'R-015', type: 'crew', name: 'Dozer Team 2', status: 'deployed', assignedTo: 'FIRE-006', personnel: 6 },
];

export const alerts: Alert[] = [
  { id: 'A-001', type: 'critical', message: 'Sierra Blaze has expanded 200 acres in the last hour. Wind shift expected.', timestamp: '2026-06-16T18:45:00Z', fireId: 'FIRE-001' },
  { id: 'A-002', type: 'critical', message: 'Thunder Peak fire threatening residential area. Evacuation orders issued.', timestamp: '2026-06-16T18:30:00Z', fireId: 'FIRE-004' },
  { id: 'A-003', type: 'warning', message: 'Red flag warning in effect for Northern California through tomorrow.', timestamp: '2026-06-16T18:00:00Z' },
  { id: 'A-004', type: 'warning', message: 'Engine 303 undergoing maintenance. ETA return to service: 4 hours.', timestamp: '2026-06-16T17:30:00Z' },
  { id: 'A-005', type: 'info', message: 'Additional resources requested for Eagle Ridge Fire.', timestamp: '2026-06-16T17:15:00Z', fireId: 'FIRE-002' },
  { id: 'A-006', type: 'info', message: 'Canyon Rim Fire containment at 90%. Expected full containment by EOD.', timestamp: '2026-06-16T16:45:00Z', fireId: 'FIRE-005' },
  { id: 'A-007', type: 'warning', message: 'Smoke visibility impacting Highway 395 near Sierra Blaze.', timestamp: '2026-06-16T16:30:00Z', fireId: 'FIRE-001' },
];

export const weatherData: WeatherData = {
  temperature: 34,
  humidity: 12,
  windSpeed: 28,
  windDirection: 'SW',
  fireRisk: 'extreme',
  condition: 'Clear & Dry',
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
  // Cities
  { id: 'TER-001', name: 'Sacramento', type: 'city', lat: 38.58, lng: -121.49, state: 'CA', population: 524943, description: 'Capital of California' },
  { id: 'TER-002', name: 'Portland', type: 'city', lat: 45.52, lng: -122.68, state: 'OR', population: 652503, description: 'Largest city in Oregon' },
  { id: 'TER-003', name: 'Seattle', type: 'city', lat: 47.61, lng: -122.33, state: 'WA', population: 737015, description: 'Largest city in Washington' },
  { id: 'TER-004', name: 'Reno', type: 'city', lat: 39.53, lng: -119.81, state: 'NV', population: 265845, description: 'The Biggest Little City' },
  { id: 'TER-005', name: 'Flagstaff', type: 'city', lat: 35.20, lng: -111.65, state: 'AZ', population: 76025, description: 'Home of Northern Arizona University' },
  
  // National Parks & Forests
  { id: 'TER-006', name: 'Yosemite National Park', type: 'park', lat: 37.75, lng: -119.57, state: 'CA', description: 'Famous for granite cliffs and waterfalls' },
  { id: 'TER-007', name: 'Crater Lake National Park', type: 'park', lat: 42.94, lng: -122.10, state: 'OR', description: 'Deepest lake in the USA' },
  { id: 'TER-008', name: 'Mount Rainier National Park', type: 'park', lat: 46.85, lng: -121.77, state: 'WA', description: 'Active volcano' },
  { id: 'TER-009', name: 'Sierra National Forest', type: 'forest', lat: 37.35, lng: -119.25, state: 'CA', description: 'Gateway to Yosemite' },
  { id: 'TER-010', name: 'Deschutes National Forest', type: 'forest', lat: 43.90, lng: -121.50, state: 'OR', description: 'Popular for recreation' },
  { id: 'TER-011', name: 'Mount Baker-Snoqualmie', type: 'forest', lat: 48.15, lng: -121.65, state: 'WA', description: 'Cascades region' },
  
  // Mountains
  { id: 'TER-012', name: 'Mount Whitney', type: 'mountain', lat: 36.58, lng: -118.29, state: 'CA', description: 'Highest peak in contiguous US' },
  { id: 'TER-013', name: 'Mount Shasta', type: 'mountain', lat: 41.41, lng: -122.19, state: 'CA', description: 'Stratovolcano' },
  { id: 'TER-014', name: 'Mount Hood', type: 'mountain', lat: 45.37, lng: -121.71, state: 'OR', description: 'Highest point in Oregon' },
  { id: 'TER-015', name: 'Mount Rainier', type: 'mountain', lat: 46.85, lng: -121.76, state: 'WA', description: '14,411 ft summit' },
  
  // Rivers
  { id: 'TER-016', name: 'Sacramento River', type: 'river', lat: 39.75, lng: -121.85, state: 'CA', description: 'Largest river in California' },
  { id: 'TER-017', name: 'Columbia River', type: 'river', lat: 46.20, lng: -119.30, state: 'OR', description: 'Largest river in Pacific Northwest' },
  { id: 'TER-018', name: 'Snake River', type: 'river', lat: 43.50, lng: -116.50, state: 'ID', description: 'Major tributary of Columbia' },
  
  // Highways
  { id: 'TER-019', name: 'Interstate 5', type: 'highway', lat: 41.00, lng: -122.00, state: 'CA', description: 'Major north-south corridor' },
  { id: 'TER-020', name: 'Highway 395', type: 'highway', lat: 37.80, lng: -119.40, state: 'CA', description: 'Eastern Sierra route' },
  { id: 'TER-021', name: 'Highway 101', type: 'highway', lat: 39.00, lng: -123.50, state: 'CA', description: 'Pacific Coast Highway' },
  
  // Regions
  { id: 'TER-022', name: 'Sierra Nevada', type: 'region', lat: 37.50, lng: -119.00, state: 'CA', description: 'Mountain range' },
  { id: 'TER-023', name: 'Cascade Range', type: 'region', lat: 44.00, lng: -121.50, state: 'OR', description: 'Volcanic mountain range' },
  { id: 'TER-024', name: 'Pacific Northwest', type: 'region', lat: 46.00, lng: -122.00, state: 'WA', description: 'Biogeographic region' },
  { id: 'TER-025', name: 'Great Basin', type: 'region', lat: 39.50, lng: -117.00, state: 'NV', description: 'Endorheic basin' },
];

export const verifiedNodes: VerifiedNode[] = [
  {
    id: 'NODE-001',
    type: 'weather-station',
    name: 'Sierra Nevada Station Alpha',
    lat: 37.75,
    lng: -119.45,
    status: 'online',
    lastReading: '2026-06-16T18:40:00Z',
    fireId: 'FIRE-001',
    verified: true,
    dataStream: 'temp,humidity,wind,pressure',
  },
  {
    id: 'NODE-002',
    type: 'iot-sensor',
    name: 'Thermal Sensor Grid T-14',
    lat: 37.82,
    lng: -119.52,
    status: 'online',
    lastReading: '2026-06-16T18:42:00Z',
    fireId: 'FIRE-001',
    verified: true,
    dataStream: 'temperature,smoke,co2',
  },
  {
    id: 'NODE-003',
    type: 'camera',
    name: 'Remote Camera RC-07',
    lat: 37.78,
    lng: -119.48,
    status: 'online',
    lastReading: '2026-06-16T18:44:00Z',
    fireId: 'FIRE-001',
    verified: true,
    dataStream: 'video,thermal-imaging',
  },
  {
    id: 'NODE-004',
    type: 'drone',
    name: 'UAV Recon Unit 3',
    lat: 47.45,
    lng: -121.15,
    status: 'online',
    lastReading: '2026-06-16T18:35:00Z',
    fireId: 'FIRE-004',
    verified: true,
    dataStream: 'video,lidar,thermal',
  },
  {
    id: 'NODE-005',
    type: 'ground-crew',
    name: 'Ground Team GT-12',
    lat: 47.52,
    lng: -121.22,
    status: 'online',
    lastReading: '2026-06-16T18:38:00Z',
    fireId: 'FIRE-004',
    verified: true,
    dataStream: 'gps,status,observations',
  },
  {
    id: 'NODE-006',
    type: 'satellite-uplink',
    name: 'Satellite Uplink SU-02',
    lat: 40.45,
    lng: -123.75,
    status: 'warning',
    lastReading: '2026-06-16T18:30:00Z',
    fireId: 'FIRE-006',
    verified: true,
    dataStream: 'satellite-data,relay',
  },
  {
    id: 'NODE-007',
    type: 'weather-station',
    name: 'Eagle Ridge Station',
    lat: 43.18,
    lng: -122.08,
    status: 'online',
    lastReading: '2026-06-16T18:41:00Z',
    fireId: 'FIRE-002',
    verified: true,
    dataStream: 'temp,humidity,wind,rain',
  },
  {
    id: 'NODE-008',
    type: 'iot-sensor',
    name: 'Air Quality Monitor AQ-05',
    lat: 35.22,
    lng: -111.68,
    status: 'offline',
    lastReading: '2026-06-16T16:20:00Z',
    fireId: 'FIRE-005',
    verified: true,
    dataStream: 'pm2.5,pm10,co,o3',
  },
  {
    id: 'NODE-009',
    type: 'camera',
    name: 'Panoramic Camera PC-03',
    lat: 38.88,
    lng: -115.28,
    status: 'online',
    lastReading: '2026-06-16T18:43:00Z',
    fireId: 'FIRE-003',
    verified: true,
    dataStream: 'video,360-panorama',
  },
  {
    id: 'NODE-010',
    type: 'drone',
    name: 'UAV Mapping Unit 7',
    lat: 43.22,
    lng: -122.12,
    status: 'online',
    lastReading: '2026-06-16T18:36:00Z',
    fireId: 'FIRE-002',
    verified: true,
    dataStream: 'video,photogrammetry',
  },
  {
    id: 'NODE-011',
    type: 'ground-crew',
    name: 'Recon Team RT-08',
    lat: 40.52,
    lng: -123.82,
    status: 'online',
    lastReading: '2026-06-16T18:39:00Z',
    fireId: 'FIRE-006',
    verified: true,
    dataStream: 'gps,photos,assessments',
  },
  {
    id: 'NODE-012',
    type: 'iot-sensor',
    name: 'Fuel Moisture Sensor FM-11',
    lat: 37.81,
    lng: -119.51,
    status: 'online',
    lastReading: '2026-06-16T18:40:00Z',
    fireId: 'FIRE-001',
    verified: true,
    dataStream: 'fuel-moisture,soil-temp',
  },
];
