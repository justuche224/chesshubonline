import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum of 6 characters required" }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "Email is required" }),
    username: z.string().min(4, { message: "Name is required" }),
    password: z
      .string()
      .min(6, { message: "Minimum of 6 characters required" }),
    confirmPassword: z.string(),
    firstname: z.string().min(1, { message: "Name is required" }),
    lastname: z.string().min(1, { message: "Name is required" }),
    gender: z.string().min(1, { message: "gender is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
