export type PlotStatus = 'AVAILABLE' | 'RESERVED' | 'BOOKED' | 'SOLD';

export interface Plot {
  id: number;
  project_id: number;
  plot_number: number;
  model_object_name: string; // e.g. "Plot_001"
  area: number;              // sq. ft
  length: number;            // ft
  width: number;             // ft
  price: number;             // in INR
  status: PlotStatus;
  facing: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  corner_plot: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  name: string;
  location: string;
  description: string;
  model_url: string;
  total_plots: number;
  created_at?: string;
  updated_at?: string;
}

export interface Enquiry {
  id: number;
  plot_id: number | null;
  plot_number?: number;
  model_object_name?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  created_at: string;
}

export interface PlotStats {
  total: number;
  available: number;
  reserved: number;
  booked: number;
  sold: number;
  totalArea: number;
  avgPrice: number;
}
