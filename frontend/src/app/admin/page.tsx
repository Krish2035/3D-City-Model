'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit2,
  Check,
  RefreshCw,
  Eye,
  Layers,
  Users,
  DollarSign,
  TrendingUp,
  X,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Plot, PlotStats, Enquiry, PlotStatus } from '@/lib/types';
import { fetchPlots, updatePlot, fetchPlotStats, fetchEnquiries } from '@/lib/api';
import { STATUS_CONFIG, formatINR } from '@/lib/constants';

export default function AdminPage() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [stats, setStats] = useState<PlotStats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'plots' | 'enquiries'>('plots');
  const [loading, setLoading] = useState(true);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Plot>>({});
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [plotData, statsData, enqData] = await Promise.all([
      fetchPlots(),
      fetchPlotStats(),
      fetchEnquiries(),
    ]);
    setPlots(plotData);
    setStats(statsData);
    setEnquiries(enqData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditClick = (plot: Plot) => {
    setEditingPlot(plot);
    setEditFormData({
      status: plot.status,
      price: Number(plot.price),
      area: Number(plot.area),
      length: Number(plot.length),
      width: Number(plot.width),
      facing: plot.facing,
      corner_plot: plot.corner_plot,
      description: plot.description || '',
    });
    setSaveStatus(null);
  };

  const handleSavePlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlot) return;

    setSaveStatus('saving');
    const res = await updatePlot(editingPlot.model_object_name, editFormData);

    if (res.success) {
      setSaveStatus('success');
      setTimeout(() => {
        setEditingPlot(null);
        setSaveStatus(null);
        loadData();
      }, 1000);
    } else {
      setSaveStatus('error');
    }
  };

  const handleQuickStatusChange = async (plot: Plot, newStatus: PlotStatus) => {
    const res = await updatePlot(plot.model_object_name, { status: newStatus });
    if (res.success) {
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                Back to 3D Viewer
              </Link>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                Admin Console
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mt-2">
              Society Inventory & Lead Manager
            </h1>
            <p className="text-sm text-slate-400">
              Manage plot availability, pricing, dimensions, and customer leads synchronized live with the 3D scene.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-200 hover:text-white transition shadow-lg self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Stats Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Plots</span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-white">{stats.total}</p>
              <p className="text-xs text-slate-500 mt-1">{stats.totalArea.toLocaleString()} total sq.ft</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Available Plots</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-2xl font-black text-emerald-400">{stats.available}</p>
              <p className="text-xs text-slate-500 mt-1">{Math.round((stats.available / stats.total) * 100)}% available</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Sold / Booked</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-indigo-400">{stats.booked + stats.sold}</p>
              <p className="text-xs text-slate-500 mt-1">{stats.sold} Sold • {stats.booked} Booked</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Average Price</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-400">{formatINR(stats.avgPrice)}</p>
              <p className="text-xs text-slate-500 mt-1">Per residential unit</p>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('plots')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'plots'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Plots Directory ({plots.length})
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Customer Leads ({enquiries.length})
          </button>
        </div>

        {/* Plots Table */}
        {activeTab === 'plots' && (
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-4 px-5">Plot #</th>
                    <th className="py-4 px-5">3D Object ID</th>
                    <th className="py-4 px-5">Area</th>
                    <th className="py-4 px-5">Dimensions</th>
                    <th className="py-4 px-5">Facing</th>
                    <th className="py-4 px-5">Price</th>
                    <th className="py-4 px-5">Live 3D Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {plots.map((plot) => {
                    const cfg = STATUS_CONFIG[plot.status];
                    return (
                      <tr key={plot.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-5 font-bold text-white">
                          Plot #{plot.plot_number}
                          {plot.corner_plot && (
                            <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              Corner
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 font-mono text-slate-400">
                          {plot.model_object_name}
                        </td>
                        <td className="py-4 px-5 font-semibold text-white">
                          {plot.area} sq.ft
                        </td>
                        <td className="py-4 px-5 text-slate-400">
                          {plot.length} × {plot.width} ft
                        </td>
                        <td className="py-4 px-5">{plot.facing}</td>
                        <td className="py-4 px-5 font-bold text-emerald-400">
                          {formatINR(Number(plot.price))}
                        </td>
                        <td className="py-4 px-5">
                          <select
                            value={plot.status}
                            onChange={(e) =>
                              handleQuickStatusChange(plot, e.target.value as PlotStatus)
                            }
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border bg-slate-900 cursor-pointer focus:outline-none ${cfg.textClass} ${cfg.borderClass}`}
                          >
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="RESERVED">RESERVED</option>
                            <option value="BOOKED">BOOKED</option>
                            <option value="SOLD">SOLD</option>
                          </select>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleEditClick(plot)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Edit details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enquiries Table */}
        {activeTab === 'enquiries' && (
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-2xl">
            {enquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No customer leads received yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-4 px-5">Lead ID</th>
                      <th className="py-4 px-5">Customer Name</th>
                      <th className="py-4 px-5">Contact</th>
                      <th className="py-4 px-5">Interested Plot</th>
                      <th className="py-4 px-5">Message</th>
                      <th className="py-4 px-5">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-5 font-bold text-white">#{enq.id}</td>
                        <td className="py-4 px-5 font-semibold text-white">{enq.customer_name}</td>
                        <td className="py-4 px-5">
                          <div>{enq.customer_phone}</div>
                          <div className="text-slate-500 text-[11px]">{enq.customer_email}</div>
                        </td>
                        <td className="py-4 px-5">
                          {enq.plot_id ? (
                            <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                              Plot #{enq.plot_id}
                            </span>
                          ) : (
                            <span className="text-slate-500">General Township</span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-slate-400 max-w-xs truncate">
                          {enq.message || '—'}
                        </td>
                        <td className="py-4 px-5 text-slate-500">
                          {new Date(enq.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Plot Modal */}
      {editingPlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-white relative">
            <button
              onClick={() => setEditingPlot(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white">
              Edit Plot #{editingPlot.plot_number} ({editingPlot.model_object_name})
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Changes update immediately in the PostgreSQL database and 3D viewer.
            </p>

            {saveStatus === 'success' && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Plot saved successfully!
              </div>
            )}

            <form onSubmit={handleSavePlot} className="mt-4 flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, status: e.target.value as PlotStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="BOOKED">BOOKED</option>
                    <option value="SOLD">SOLD</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={editFormData.price || ''}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Super Area (sq.ft)</label>
                  <input
                    type="number"
                    value={editFormData.area || ''}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, area: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Length (ft)</label>
                  <input
                    type="number"
                    value={editFormData.length || ''}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, length: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Width (ft)</label>
                  <input
                    type="number"
                    value={editFormData.width || ''}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, width: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Facing</label>
                  <select
                    value={editFormData.facing}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, facing: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                    <option value="North-East">North-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                    <input
                      type="checkbox"
                      checked={!!editFormData.corner_plot}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, corner_plot: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700 focus:ring-0"
                    />
                    Is Corner Plot
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Description</label>
                <textarea
                  rows={2}
                  value={editFormData.description || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saveStatus === 'saving'}
                className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Save className="w-4 h-4" />
                {saveStatus === 'saving' ? 'Saving Changes...' : 'Save Plot Updates'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
