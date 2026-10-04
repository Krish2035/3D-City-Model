import { z } from 'zod';

export const PlotStatusEnum = z.enum(['AVAILABLE', 'RESERVED', 'BOOKED', 'SOLD']);

export const UpdatePlotSchema = z.object({
  status: PlotStatusEnum.optional(),
  price: z.number().positive('Price must be greater than 0').optional(),
  area: z.number().positive('Area must be positive').optional(),
  length: z.number().positive('Length must be positive').optional(),
  width: z.number().positive('Width must be positive').optional(),
  facing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']).optional(),
  corner_plot: z.boolean().optional(),
  description: z.string().max(1000).optional(),
});

export const QueryPlotsSchema = z.object({
  status: PlotStatusEnum.optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  facing: z.string().optional(),
  search: z.string().optional(),
});

export type UpdatePlotInput = z.infer<typeof UpdatePlotSchema>;
export type QueryPlotsInput = z.infer<typeof QueryPlotsSchema>;
