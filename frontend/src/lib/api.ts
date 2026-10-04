import { API_BASE_URL } from './constants';
import { Plot, Project, Enquiry, PlotStats, PlotStatus } from './types';

export async function fetchProject(): Promise<Project | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/project`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch project');
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn('API error fetching project, using fallback:', err);
    return {
      id: 1,
      name: 'The Heritage Palms Enclave',
      location: 'Greenfield Corridor, Sector 42',
      description: 'A premium gated villa township offering landscaped residential plots.',
      model_url: '/models/society.glb',
      total_plots: 15,
    };
  }
}

export async function fetchPlots(filters?: {
  status?: PlotStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Promise<Plot[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.search) params.append('search', filters.search);

    const url = `${API_BASE_URL}/plots${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch plots');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('API error fetching plots:', err);
    return [];
  }
}

export async function fetchPlotByIdentifier(identifier: string | number): Promise<Plot | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/plots/${identifier}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`API error fetching plot ${identifier}:`, err);
    return null;
  }
}

export async function updatePlot(
  identifier: string | number,
  data: Partial<Plot>
): Promise<{ success: boolean; data?: Plot; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/plots/${identifier}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(`API error updating plot ${identifier}:`, err);
    return { success: false, message: 'Network error updating plot' };
  }
}

export async function fetchPlotStats(): Promise<PlotStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/plots/stats`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch stats');
    const json = await res.json();
    return json.stats || null;
  } catch (err) {
    console.error('API error fetching stats:', err);
    return null;
  }
}

export async function submitEnquiry(payload: {
  plot_id?: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('API error submitting enquiry:', err);
    return { success: false, message: 'Failed to submit enquiry. Please check backend connection.' };
  }
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/enquiries`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('API error fetching enquiries:', err);
    return [];
  }
}
