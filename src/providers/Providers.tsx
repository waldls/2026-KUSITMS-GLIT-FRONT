"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { meQueryKey, useMe } from "@/lib/hooks/user/userClient";

import AuthGate from "./AuthGate";

const REACT_QUERY_SESSION_CACHE_KEY = "glit-react-query-cache";

function ProvidersContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useMe({ enabled: !pathname.startsWith("/auth") });

  return <>{children}</>;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [persister, setPersister] = useState<ReturnType<typeof createSyncStoragePersister> | null>(
    null,
  );

  useEffect(() => {
    setPersister(
      createSyncStoragePersister({
        key: REACT_QUERY_SESSION_CACHE_KEY,
        storage: window.sessionStorage,
      }),
    );
  }, []);

  useEffect(() => {
    const loadFcm = () => {
      void import("@/lib/utils/fcm");
    };

    const idleCallback = window.requestIdleCallback?.(loadFcm);
    if (idleCallback !== undefined) {
      return () => window.cancelIdleCallback(idleCallback);
    }

    const timer = window.setTimeout(loadFcm, 3000);
    return () => window.clearTimeout(timer);
  }, []);

  const authGate = (
    <AuthGate>
      <ProvidersContent>{children}</ProvidersContent>
    </AuthGate>
  );

  if (!persister) {
    return <QueryClientProvider client={queryClient}>{authGate}</QueryClientProvider>;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: query =>
            Array.isArray(query.queryKey) && query.queryKey[0] === meQueryKey[0],
        },
      }}>
      {authGate}
    </PersistQueryClientProvider>
  );
}
