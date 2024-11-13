"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail, getUserByUsername } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import * as z from "zod";
import { gender } from "@prisma/client";

type RegisterValues = z.infer<typeof RegisterSchema>;

export const register = async (values: RegisterValues) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const {
    email,
    password,
    firstname,
    lastname,
    gender: userGender,
    username,
    confirmPassword,
  } = validatedFields.data;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const existingUsername = await getUserByUsername(username);

  if (existingUsername) {
    return { error: "Username already in use!" };
  }

  await db.user.create({
    data: {
      firstname,
      lastname,
      gender: userGender as gender,
      username,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return { success: "Confirmation email sent!" };
};
