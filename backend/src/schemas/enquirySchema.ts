import { z } from 'zod';

export const CreateEnquirySchema = z.object({
  plot_id: z.number().int().positive().nullable().optional(),
  customer_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customer_email: z.string().email('Invalid email address'),
  customer_phone: z.string().min(7, 'Phone number must be at least 7 digits').max(20),
  message: z.string().max(1000).optional(),
});

export type CreateEnquiryInput = z.infer<typeof CreateEnquirySchema>;
