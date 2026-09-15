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
