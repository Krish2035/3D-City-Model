import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not defined.');
  console.log('👉 Please set DATABASE_URL in your backend/.env file (e.g., your Neon PostgreSQL connection string).');
  process.exit(1);
}

const isSsl =
  process.env.NODE_ENV === 'production' ||
  DATABASE_URL.includes('sslmode=require') ||
  DATABASE_URL.includes('neon.tech');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: isSsl ? { rejectUnauthorized: false } : false
});

async function runSeed() {
  console.log('🚀 Connecting to PostgreSQL / Neon...');
  const client = await pool.connect();

  try {
    console.log('📄 Executing schema.sql to create tables...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await client.query(schemaSql);
    console.log('✅ Tables (projects, plots, enquiries) created / verified.');

    // 1. Insert Project if not exists
    console.log('🌱 Seeding project data...');
    const projectRes = await client.query('SELECT id FROM projects WHERE id = 1');
    if (projectRes.rows.length === 0) {
      await client.query(`
        INSERT INTO projects (id, name, location, description, model_url, total_plots)
        VALUES (
          1,
          'The Heritage Palms Enclave',
          'Greenfield Corridor, Sector 42',
          'A premium gated villa township offering landscaped residential plots with world-class avenues, high-speed connectivity, and modern infrastructure.',
          '/models/society.glb',
          15
        )
      `);
      console.log('✅ Default project created.');
    } else {
      console.log('ℹ️ Default project already exists.');
    }

    // 2. Insert Plots
    console.log('🌱 Seeding plots (1 to 15)...');
    const initialPlots = [
      { plot_number: 1, model_object_name: 'Plot_001', area: 1800, length: 60, width: 30, price: 3600000, status: 'AVAILABLE', facing: 'East', corner_plot: true, description: 'Grand corner plot adjacent to the main 40ft wide boulevard with dual road access.' },
      { plot_number: 2, model_object_name: 'Plot_002', area: 1500, length: 50, width: 30, price: 3000000, status: 'RESERVED', facing: 'East', corner_plot: false, description: 'Prime residential plot with unobstructed morning sunlight and direct park views.' },
      { plot_number: 3, model_object_name: 'Plot_003', area: 1500, length: 50, width: 30, price: 3000000, status: 'AVAILABLE', facing: 'East', corner_plot: false, description: 'Well-proportioned plot ideal for duplex villa construction with Vastu compliance.' },
      { plot_number: 4, model_object_name: 'Plot_004', area: 2100, length: 70, width: 30, price: 4400000, status: 'SOLD', facing: 'North', corner_plot: true, description: 'Premium north-facing corner parcel offering maximum frontage and lawn space.' },
      { plot_number: 5, model_object_name: 'Plot_005', area: 1650, length: 55, width: 30, price: 3300000, status: 'AVAILABLE', facing: 'North', corner_plot: false, description: 'Serene plot located in central residential block near community park.' },
      { plot_number: 6, model_object_name: 'Plot_006', area: 1650, length: 55, width: 30, price: 3300000, status: 'BOOKED', facing: 'North', corner_plot: false, description: 'Centrally placed plot with immediate access to jogging tracks and clubhouse.' },
      { plot_number: 7, model_object_name: 'Plot_007', area: 1800, length: 60, width: 30, price: 3750000, status: 'AVAILABLE', facing: 'North-East', corner_plot: true, description: 'Highly desirable North-East facing plot with high investment appreciation value.' },
      { plot_number: 8, model_object_name: 'Plot_008', area: 1500, length: 50, width: 30, price: 2950000, status: 'AVAILABLE', facing: 'West', corner_plot: false, description: 'Modern villa plot with serene sunset vistas and paved pedestrian walkway.' },
      { plot_number: 9, model_object_name: 'Plot_009', area: 1500, length: 50, width: 30, price: 2950000, status: 'SOLD', facing: 'West', corner_plot: false, description: 'Quiet cul-de-sac adjacent parcel with minimal vehicular movement.' },
      { plot_number: 10, model_object_name: 'Plot_010', area: 2400, length: 80, width: 30, price: 5200000, status: 'RESERVED', facing: 'West', corner_plot: true, description: 'Estate-sized plot designed for luxury sprawling residence with private garden.' },
      { plot_number: 11, model_object_name: 'Plot_011', area: 1500, length: 50, width: 30, price: 3100000, status: 'AVAILABLE', facing: 'South', corner_plot: false, description: 'Compact family plot featuring direct utility lines and paved street lighting.' },
      { plot_number: 12, model_object_name: 'Plot_012', area: 1500, length: 50, width: 30, price: 3100000, status: 'AVAILABLE', facing: 'South', corner_plot: false, description: 'Strategically located plot near upcoming children play area and sports arena.' },
      { plot_number: 13, model_object_name: 'Plot_013', area: 1800, length: 60, width: 30, price: 3800000, status: 'BOOKED', facing: 'South-East', corner_plot: true, description: 'Corner plot with panoramic street angles and double tree canopy buffer.' },
      { plot_number: 14, model_object_name: 'Plot_014', area: 1650, length: 55, width: 30, price: 3400000, status: 'AVAILABLE', facing: 'East', corner_plot: false, description: 'East-facing avenue plot with high green cover and underground cabling connection.' },
      { plot_number: 15, model_object_name: 'Plot_015', area: 2000, length: 65, width: 30.7, price: 4250000, status: 'AVAILABLE', facing: 'North-East', corner_plot: true, description: 'Corner showcase plot located at the entrance boulevard roundabout.' }
    ];

    for (const plot of initialPlots) {
      await client.query(`
        INSERT INTO plots (project_id, plot_number, model_object_name, area, length, width, price, status, facing, corner_plot, description)
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (plot_number) DO UPDATE
        SET status = EXCLUDED.status,
            price = EXCLUDED.price,
            description = EXCLUDED.description;
      `, [
        plot.plot_number,
        plot.model_object_name,
        plot.area,
        plot.length,
        plot.width,
        plot.price,
        plot.status,
        plot.facing,
        plot.corner_plot,
        plot.description
      ]);
    }

    console.log('✅ All 15 plots successfully seeded/updated in Neon PostgreSQL!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
