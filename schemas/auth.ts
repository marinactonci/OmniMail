import { z } from "zod";

export const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(20, { message: "First name cannot exceed 20 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(20, { message: "Last name cannot exceed 20 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
  repeatPassword: z.string(),
});

export const signUpFormSchema = formSchema.refine(
  (data) => data.password === data.repeatPassword,
  {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  }
);

export const signInFormSchema = formSchema.pick({
  email: true,
  password: true,
});
