/* eslint-disable import/no-anonymous-default-export */
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        //console.log(1);
        //console.log(credentials);
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          // console.log(2);

          // console.log(user);
          if (!user || !user.password) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // console.log(3);

            // console.log(user);
            return user;
          }
        }
        // console.log("going null");
        return null;
      },
    }),
  ],
};
