import { z } from 'zod';

export const arMediaSchema = z.object({
  id: z.string(),
  type: z.enum(['audio', 'image', 'video', 'model', 'unknown']),
  filename: z.string(),
  url: z.string(),
  poiId: z.string().optional(),
});

export type ARMedia = z.infer<typeof arMediaSchema>;
