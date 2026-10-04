import { Request, Response } from 'express';
import { localStore, getPool, EnquiryRecord } from '../config/db';
import { CreateEnquirySchema } from '../schemas/enquirySchema';

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const parseResult = CreateEnquirySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, errors: parseResult.error.flatten() });
    }

    const { plot_id, customer_name, customer_email, customer_phone, message } = parseResult.data;
    const pool = getPool();

    if (pool) {
      const result = await pool.query(
        `INSERT INTO enquiries (plot_id, customer_name, customer_email, customer_phone, message)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [plot_id || null, customer_name, customer_email, customer_phone, message || null]
      );
      return res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully! Our sales team will get back to you shortly.',
        data: result.rows[0]
      });
    }

    const newEnquiry: EnquiryRecord = {
      id: localStore.data.enquiries.length + 1,
      plot_id: plot_id || null,
      customer_name,
      customer_email,
      customer_phone,
      message: message || '',
      status: 'NEW',
      created_at: new Date().toISOString()
    };

    localStore.data.enquiries.unshift(newEnquiry);
    localStore.save();

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Our sales team will get back to you shortly.',
      data: newEnquiry
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return res.status(500).json({ success: false, message: 'Server error processing enquiry' });
  }
};

export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    if (pool) {
      const result = await pool.query(`
        SELECT e.*, p.model_object_name, p.plot_number
        FROM enquiries e
        LEFT JOIN plots p ON e.plot_id = p.id
        ORDER BY e.created_at DESC
      `);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    }

    return res.json({
      success: true,
      count: localStore.data.enquiries.length,
      data: localStore.data.enquiries
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching enquiries' });
  }
};
