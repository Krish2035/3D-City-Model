import { Request, Response } from 'express';
import { localStore, getPool } from '../config/db';

export const getProject = async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    if (pool) {
      const result = await pool.query('SELECT * FROM projects LIMIT 1');
      if (result.rows.length > 0) {
        return res.json({ success: true, data: result.rows[0] });
      }
    }

    const project = localStore.data.projects[0];
    return res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching project' });
  }
};
