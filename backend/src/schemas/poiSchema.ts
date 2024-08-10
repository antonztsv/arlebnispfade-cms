import { z } from 'zod';

export const poiSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  image: z.string().min(1, 'Image is required'),
  layout: z.string().min(1, 'Layout is required'),
  gmaps: z.string().url('Invalid Google Maps URL').nullish().optional(),
  coords: z.tuple([z.number(), z.number()]).describe('Coordinates must be an array of two numbers'),
  info: z.string().min(1, 'Info is required'),
  arDesc: z.string().min(1, 'AR description is required'),
  ar: z.object({
    type: z.string().min(1, 'AR type is required'),
    content: z.string().min(1, 'AR content is required'),
    location: z.string().min(1, 'AR location is required'),
    video: z.array(z.any()).optional(),
    audio: z.object({ filename: z.string() }).optional(),
    nft: z.array(z.any()).optional(),
  }),
  content: z.string().optional(),
});

export type POI = z.infer<typeof poiSchema>;
