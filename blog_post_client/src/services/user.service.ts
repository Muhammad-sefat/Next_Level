import { env } from "../env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;

export const userService = {
  getSession: async function () {
    try {
      const storeCookies = await cookies();
      console.log(storeCookies.toString());

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: storeCookies.toString(),
        },
        cache: "no-store",
      });

      const session = await res.json();
      console.log(session);
      return { data: session, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error: { message: "Failed to fetch session" } };
    }
  },
};
