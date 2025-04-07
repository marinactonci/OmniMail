import { z } from "zod";

export const emailAddressSchema = z.object({
  name: z.string(),
  address: z.string(),
})