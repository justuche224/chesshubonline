import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import { Game, Move, User } from "@prisma/client";

export type CompleteGameData = Game & {
  whitePlayer: User;
  blackPlayer: User;
  moves: Move[];
};

export type NewPasswordValues = z.infer<typeof NewPasswordSchema>;

export type UserWithColor = {
  id: string | undefined;
  username?: string | null;
  email?: string | null;
  image?: string | null;
  color: string;
};
