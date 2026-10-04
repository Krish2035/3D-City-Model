import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

export interface ProjectRecord {
  id: number;
  name: string;
  location: string;
  description: string;
  model_url: string;
  total_plots: number;
  created_at: string;
  updated_at: string;
}

export interface PlotRecord {
  id: number;
  project_id: number;
  plot_number: number;
  model_object_name: string; // e.g. "Plot_001" to "Plot_015"
  area: number;              // sq.ft
  length: number;            // ft
  width: number;             // ft
  price: number;             // in INR
  status: 'AVAILABLE' | 'RESERVED' | 'BOOKED' | 'SOLD';
  facing: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  corner_plot: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EnquiryRecord {
  id: number;
  plot_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  created_at: string;
}

// Fallback JSON-backed storage for instant out-of-the-box operation without requiring local Postgres daemon
class LocalStore {
  private filePath = path.join(__dirname, '../../data/society_db.json');
  public data: {
    projects: ProjectRecord[];
    plots: PlotRecord[];
    enquiries: EnquiryRecord[];
  } = {
    projects: [],
    plots: [],
    enquiries: []
  };

  constructor() {
    this.ensureDirectory();
    this.load();
  }

  private ensureDirectory() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  public load() {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
        return;
      } catch (err) {
        console.error('Error reading local JSON db, re-initializing...', err);
      }
    }
    this.seedDefault();
    this.save();
  }

  public save() {
    this.ensureDirectory();
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  public seedDefault() {
    const defaultProject: ProjectRecord = {
      id: 1,
      name: 'The Heritage Palms Enclave',
      location: 'Greenfield Corridor, Sector 42',
      description: 'A premium gated villa township offering landscaped residential plots with world-class avenues, high-speed connectivity, and modern infrastructure.',
      model_url: '/models/society.glb',
      total_plots: 15,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const initialPlots: PlotRecord[] = [
      { id: 1, project_id: 1, plot_number: 1, model_object_name: 'Plot_001', area: 1800, length: 60, width: 30, price: 3600000, status: 'AVAILABLE', facing: 'East', corner_plot: true, description: 'Grand corner plot adjacent to the main 40ft wide boulevard with dual road access.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 2, project_id: 1, plot_number: 2, model_object_name: 'Plot_002', area: 1500, length: 50, width: 30, price: 3000000, status: 'RESERVED', facing: 'East', corner_plot: false, description: 'Prime residential plot with unobstructed morning sunlight and direct park views.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 3, project_id: 1, plot_number: 3, model_object_name: 'Plot_003', area: 1500, length: 50, width: 30, price: 3000000, status: 'AVAILABLE', facing: 'East', corner_plot: false, description: 'Well-proportioned plot ideal for duplex villa construction with Vastu compliance.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 4, project_id: 1, plot_number: 4, model_object_name: 'Plot_004', area: 2100, length: 70, width: 30, price: 4400000, status: 'SOLD', facing: 'North', corner_plot: true, description: 'Premium north-facing corner parcel offering maximum frontage and lawn space.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 5, project_id: 1, plot_number: 5, model_object_name: 'Plot_005', area: 1650, length: 55, width: 30, price: 3300000, status: 'AVAILABLE', facing: 'North', corner_plot: false, description: 'Serene plot located in central residential block near community park.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 6, project_id: 1, plot_number: 6, model_object_name: 'Plot_006', area: 1650, length: 55, width: 30, price: 3300000, status: 'BOOKED', facing: 'North', corner_plot: false, description: 'Centrally placed plot with immediate access to jogging tracks and clubhouse.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 7, project_id: 1, plot_number: 7, model_object_name: 'Plot_007', area: 1800, length: 60, width: 30, price: 3750000, status: 'AVAILABLE', facing: 'North-East', corner_plot: true, description: 'Highly desirable North-East facing plot with high investment appreciation value.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 8, project_id: 1, plot_number: 8, model_object_name: 'Plot_008', area: 1500, length: 50, width: 30, price: 2950000, status: 'AVAILABLE', facing: 'West', corner_plot: false, description: 'Modern villa plot with serene sunset vistas and paved pedestrian walkway.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 9, project_id: 1, plot_number: 9, model_object_name: 'Plot_009', area: 1500, length: 50, width: 30, price: 2950000, status: 'SOLD', facing: 'West', corner_plot: false, description: 'Quiet cul-de-sac adjacent parcel with minimal vehicular movement.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 10, project_id: 1, plot_number: 10, model_object_name: 'Plot_010', area: 2400, length: 80, width: 30, price: 5200000, status: 'RESERVED', facing: 'West', corner_plot: true, description: 'Estate-sized plot designed for luxury sprawling residence with private garden.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 11, project_id: 1, plot_number: 11, model_object_name: 'Plot_011', area: 1500, length: 50, width: 30, price: 3100000, status: 'AVAILABLE', facing: 'South', corner_plot: false, description: 'Compact family plot featuring direct utility lines and paved street lighting.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 12, project_id: 1, plot_number: 12, model_object_name: 'Plot_012', area: 1500, length: 50, width: 30, price: 3100000, status: 'AVAILABLE', facing: 'South', corner_plot: false, description: 'Strategically located plot near upcoming children play area and sports arena.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 13, project_id: 1, plot_number: 13, model_object_name: 'Plot_013', area: 1800, length: 60, width: 30, price: 3800000, status: 'BOOKED', facing: 'South-East', corner_plot: true, description: 'Corner plot with panoramic street angles and double tree canopy buffer.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 14, project_id: 1, plot_number: 14, model_object_name: 'Plot_014', area: 1650, length: 55, width: 30, price: 3400000, status: 'AVAILABLE', facing: 'East', corner_plot: false, description: 'East-facing avenue plot with high green cover and underground cabling connection.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 15, project_id: 1, plot_number: 15, model_object_name: 'Plot_015', area: 2000, length: 65, width: 30.7, price: 4250000, status: 'AVAILABLE', facing: 'North-East', corner_plot: true, description: 'Corner showcase plot located at the entrance boulevard roundabout.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];

    this.data = {
      projects: [defaultProject],
      plots: initialPlots,
      enquiries: []
    };
  }
}

export const localStore = new LocalStore();

let pgPool: Pool | null = null;
if (process.env.DATABASE_URL) {
  const isSsl =
    process.env.NODE_ENV === 'production' ||
    process.env.DATABASE_URL.includes('sslmode=require') ||
    process.env.DATABASE_URL.includes('neon.tech');
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isSsl ? { rejectUnauthorized: false } : false
  });
  pgPool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client, falling back to local storage', err);
  });
}

export const getPool = () => pgPool;
