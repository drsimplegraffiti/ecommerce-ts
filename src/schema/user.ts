import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3),
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6)
});

export const LoginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6)
});

export const ProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  tags: z.array(z.string()),
  description: z.string().min(10)
});

export const UpdateProductSchema = z.object({
  // name: z.string().min(3).optional(),
  name: z.string().min(3),
  price: z.number().positive(),
  tags: z.array(z.string()),
  description: z.string().min(10)
});

export const AddressSchema = z.object({
  lineOne:z.string(),
  lineTwo: z.string().nullable(),
  city: z.string(),
  country: z.string(), 
  pincode: z.string().length(6)
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional()
});

export const changeUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "USER"])
});

export const otpSchema = z.object({
  otp: z.string().length(6),
  email: z.string().email()
});