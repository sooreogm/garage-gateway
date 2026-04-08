import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import type { KeyListItem, KeyInfo, CreateKeyRequest } from "@/lib/garage/types";

export function useKeys() {
  return useSWR<KeyListItem[]>("/api/garage/keys");
}

export function useKey(id: string) {
  return useSWR<KeyInfo>(id ? `/api/garage/keys/${id}` : null);
}

export function useCreateKey() {
  return useSWRMutation(
    "/api/garage/keys",
    async (url: string, { arg }: { arg: CreateKeyRequest }) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Failed to create key");
      }
      return res.json() as Promise<KeyInfo>;
    },
  );
}
