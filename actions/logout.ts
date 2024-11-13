"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  //some server magic
  await signOut();
};
