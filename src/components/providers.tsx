"use client";

import { SWRConfig } from "swr";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `Request failed with status ${res.status}`);
  }
  return res.json();
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        errorRetryCount: 2,
      }}
    >
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </SWRConfig>
  );
}
