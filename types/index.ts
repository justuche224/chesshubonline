import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";

export type NewPasswordValues = z.infer<typeof NewPasswordSchema>;

export type UserWithColor = {
  id: string | undefined;
  username?: string | null;
  email?: string | null;
  image?: string | null;
  color: string;
};
