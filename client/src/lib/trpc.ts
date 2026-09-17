import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import superjson from "superjson";
import type { ReactNode } from "react";
import { useState, createElement } from "react";
import type { AppRouter } from "../../server/routers";

export const trpc = createTRPCReact<AppRouter>();

export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

export function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${baseUrl}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  );

  return createElement(
    trpc.Provider as any,
    { client: trpcClient, queryClient },
    children
  );
}
