import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../server/routers";

const baseUrl = typeof window !== "undefined"
  ? window.location.origin
  : "http://localhost:3000";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${baseUrl}/api/trpc`,
      fetch: async (input, init?) => {
        const response = await fetch(input, {
          ...init,
          credentials: "include",
        });
        return response;
      },
    }),
  ],
});
