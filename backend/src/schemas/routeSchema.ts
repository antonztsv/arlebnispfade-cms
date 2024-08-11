import { z } from 'zod';

export const routeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  layout: z.string().min(1, 'Layout is required'),
  image: z.string().min(1, 'Image is required'),
  type: z.string().min(1, 'Type is required'),
});

export type Route = z.infer<typeof routeSchema>;
