import { z } from 'zod';

/** Public listing slice for guia comercial (shared API/web contract). */
export const publicListingSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  categorySlug: z.string(),
  citySlug: z.string(),
});

export type PublicListing = z.infer<typeof publicListingSchema>;

export const publicListingListSchema = z.object({
  items: z.array(publicListingSchema),
  total: z.number().int().nonnegative(),
});

export type PublicListingList = z.infer<typeof publicListingListSchema>;
