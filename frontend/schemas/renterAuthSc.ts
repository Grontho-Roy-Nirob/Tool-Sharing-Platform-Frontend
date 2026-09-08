import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(150, "Full name is too long"),

  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password is too long"),

  phone: z.string().optional(),

  nidNumber: z
    .string()
    .min(1, "NID number is required")
    .regex(/^\d+$/, "NID must contain only numbers"),

  profileImage: z.instanceof(File).optional(),
});
