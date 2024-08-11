import { z } from 'zod';

export const imageSchema = z.object({
  id: z.string(),
  filename: z.string(),
  url: z.string(),
});

export type Image = z.infer<typeof imageSchema>;
