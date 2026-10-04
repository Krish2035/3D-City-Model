import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes';
import plotRoutes from './routes/plotRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import { localStore } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/project', projectRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Root landing endpoint
app.get('/', (req, res) => {
  res.json({
    name: '3D City Model & Society Platform API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      plots: '/api/plots',
      project: '/api/project',
      enquiries: '/api/enquiries'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    totalPlots: localStore.data.plots.length,
    dbMode: process.env.DATABASE_URL ? 'PostgreSQL' : 'LocalPersistentStore'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 3D Society Backend Server running at http://localhost:${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/health`);
  console.log(`📍 Plots API: http://localhost:${PORT}/api/plots`);
  console.log(`📍 Project API: http://localhost:${PORT}/api/project`);
});

export default app;
