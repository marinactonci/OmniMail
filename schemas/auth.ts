import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters long" })
    .max(40, { message: "Name cannot exceed 40 characters" }),
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
  password: true
})