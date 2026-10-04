import { Request, Response } from 'express';
import { localStore, getPool, PlotRecord } from '../config/db';
import { QueryPlotsSchema, UpdatePlotSchema } from '../schemas/plotSchema';

export const getPlots = async (req: Request, res: Response) => {
  try {
    const parseResult = QueryPlotsSchema.safeParse(req.query);
    const query = parseResult.success ? parseResult.data : {};

    const pool = getPool();
    if (pool) {
      let sql = 'SELECT * FROM plots WHERE 1=1';
      const params: any[] = [];

      if (query.status) {
        params.push(query.status);
        sql += ` AND status = $${params.length}`;
      }
      if (query.minPrice !== undefined) {
        params.push(query.minPrice);
        sql += ` AND price >= $${params.length}`;
      }
      if (query.maxPrice !== undefined) {
        params.push(query.maxPrice);
        sql += ` AND price <= $${params.length}`;
      }
      if (query.search) {
        params.push(`%${query.search}%`);
        sql += ` AND (model_object_name ILIKE $${params.length} OR plot_number::text ILIKE $${params.length})`;
      }
      sql += ' ORDER BY plot_number ASC';

      const result = await pool.query(sql, params);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    }

    // Local in-memory / JSON store fallback
    let plots = [...localStore.data.plots];
    if (query.status) {
      plots = plots.filter((p) => p.status === query.status);
    }
    if (query.minPrice !== undefined) {
      plots = plots.filter((p) => p.price >= (query.minPrice || 0));
    }
    if (query.maxPrice !== undefined) {
      plots = plots.filter((p) => p.price <= (query.maxPrice || Infinity));
    }
    if (query.minArea !== undefined) {
      plots = plots.filter((p) => p.area >= (query.minArea || 0));
    }
    if (query.maxArea !== undefined) {
      plots = plots.filter((p) => p.area <= (query.maxArea || Infinity));
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      plots = plots.filter(
        (p) =>
          p.model_object_name.toLowerCase().includes(s) ||
          p.plot_number.toString().includes(s) ||
          (p.facing && p.facing.toLowerCase().includes(s))
      );
    }

    plots.sort((a, b) => a.plot_number - b.plot_number);
    return res.json({ success: true, count: plots.length, data: plots });
  } catch (error) {
    console.error('Error fetching plots:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching plots' });
  }
};

export const getPlotByIdentifier = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params; // Can be "1", "Plot_001", "Plot_1", etc.
    const pool = getPool();

    let targetNumber: number | null = null;
    let targetName: string = identifier;

    if (!isNaN(Number(identifier))) {
      targetNumber = Number(identifier);
    } else {
      const match = identifier.match(/Plot_(\d+)/i);
      if (match) {
        targetNumber = parseInt(match[1], 10);
      }
    }

    if (pool) {
      const result = await pool.query(
        'SELECT * FROM plots WHERE model_object_name ILIKE $1 OR plot_number = $2 LIMIT 1',
        [targetName, targetNumber || -1]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: `Plot '${identifier}' not found` });
      }
      return res.json({ success: true, data: result.rows[0] });
    }

    const plot = localStore.data.plots.find(
      (p) =>
        p.model_object_name.toLowerCase() === targetName.toLowerCase() ||
        (targetNumber !== null && p.plot_number === targetNumber)
    );

    if (!plot) {
      return res.status(404).json({ success: false, message: `Plot '${identifier}' not found` });
    }

    return res.json({ success: true, data: plot });
  } catch (error) {
    console.error('Error fetching plot details:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching plot details' });
  }
};

export const updatePlot = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const parseResult = UpdatePlotSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, errors: parseResult.error.flatten() });
    }

    const updates = parseResult.data;
    const pool = getPool();

    let targetNumber: number | null = !isNaN(Number(identifier)) ? Number(identifier) : null;
    if (!targetNumber) {
      const m = identifier.match(/Plot_(\d+)/i);
      if (m) targetNumber = parseInt(m[1], 10);
    }

    if (pool) {
      const checkRes = await pool.query(
        'SELECT * FROM plots WHERE model_object_name ILIKE $1 OR plot_number = $2 LIMIT 1',
        [identifier, targetNumber || -1]
      );
      if (checkRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Plot not found' });
      }

      const existing = checkRes.rows[0];
      const updatedRecord = {
        ...existing,
        ...updates,
        updated_at: new Date().toISOString()
      };

      const updateQuery = `
        UPDATE plots SET
          status = $1, price = $2, area = $3, length = $4, width = $5,
          facing = $6, corner_plot = $7, description = $8, updated_at = $9
        WHERE id = $10
        RETURNING *;
      `;
      const updateRes = await pool.query(updateQuery, [
        updatedRecord.status,
        updatedRecord.price,
        updatedRecord.area,
        updatedRecord.length,
        updatedRecord.width,
        updatedRecord.facing,
        updatedRecord.corner_plot,
        updatedRecord.description,
        updatedRecord.updated_at,
        existing.id
      ]);

      return res.json({ success: true, message: 'Plot updated successfully', data: updateRes.rows[0] });
    }

    const idx = localStore.data.plots.findIndex(
      (p) =>
        p.model_object_name.toLowerCase() === identifier.toLowerCase() ||
        (targetNumber !== null && p.plot_number === targetNumber)
    );

    if (idx === -1) {
      return res.status(404).json({ success: false, message: `Plot '${identifier}' not found` });
    }

    const current = localStore.data.plots[idx];
    const updated: PlotRecord = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString()
    };

    localStore.data.plots[idx] = updated;
    localStore.save();

    return res.json({ success: true, message: 'Plot updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating plot:', error);
    return res.status(500).json({ success: false, message: 'Server error updating plot' });
  }
};

export const getPlotStats = async (req: Request, res: Response) => {
  try {
    const plots = localStore.data.plots;
    const total = plots.length;
    const available = plots.filter((p) => p.status === 'AVAILABLE').length;
    const reserved = plots.filter((p) => p.status === 'RESERVED').length;
    const booked = plots.filter((p) => p.status === 'BOOKED').length;
    const sold = plots.filter((p) => p.status === 'SOLD').length;

    const totalArea = plots.reduce((acc, p) => acc + Number(p.area), 0);
    const avgPrice = total > 0 ? plots.reduce((acc, p) => acc + Number(p.price), 0) / total : 0;

    return res.json({
      success: true,
      stats: {
        total,
        available,
        reserved,
        booked,
        sold,
        totalArea,
        avgPrice: Math.round(avgPrice)
      }
    });
  } catch (error) {
    console.error('Error fetching plot stats:', error);
    return res.status(500).json({ success: false, message: 'Server error calculating stats' });
  }
};
