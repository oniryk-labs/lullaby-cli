import { z } from "zod";

export const issue = z.object({
  message: z.string(),
  name: z.string(),
  suggestion: z.string().optional().nullable(),
});

export const response = z.object({
  valid: z.boolean(),
  issues: z.array(issue),
});
