import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(150, "Name is too long"),

  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password is too long"),

  phone: z.string().min(1, "Phone number is required"),

  nidNumber: z
    .string()
    .regex(/^\d{10}$/, "NID number must be exactly 10 digits"),

  profile_image: z.instanceof(File).optional(),
});