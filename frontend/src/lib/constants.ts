import { PlotStatus } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const STATUS_CONFIG: Record<
  PlotStatus,
  {
    label: string;
    color: string;
    hex: number;
    bgClass: string;
    textClass: string;
    borderClass: string;
    badgeClass: string;
  }
> = {
  AVAILABLE: {
    label: 'Available',
    color: '#10B981',
    hex: 0x10b981,
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/40',
    badgeClass: 'bg-emerald-500 text-slate-950 font-semibold',
  },
  RESERVED: {
    label: 'Reserved',
    color: '#F59E0B',
    hex: 0xf59e0b,
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/40',
    badgeClass: 'bg-amber-500 text-slate-950 font-semibold',
  },
  BOOKED: {
    label: 'Booked',
    color: '#6366F1',
    hex: 0x6366f1,
    bgClass: 'bg-indigo-500/15',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-500/40',
    badgeClass: 'bg-indigo-500 text-white font-semibold',
  },
  SOLD: {
    label: 'Sold',
    color: '#EF4444',
    hex: 0xef4444,
    bgClass: 'bg-rose-500/15',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/40',
    badgeClass: 'bg-rose-500 text-white font-semibold',
  },
};

export function formatINR(amount: number): string {
  if (!amount && amount !== 0) return '₹ 0';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹ ${cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const l = amount / 100000;
    return `₹ ${l.toFixed(2)} Lakhs`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
