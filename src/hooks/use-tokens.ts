import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import type {
  AdminTokenListItem,
  AdminTokenInfo,
  CreateAdminTokenRequest,
  CreateAdminTokenResponse,
} from "@/lib/garage/types";

export function useAdminTokens() {
  return useSWR<AdminTokenListItem[]>("/api/garage/tokens");
}

export function useAdminToken(id: string) {
  return useSWR<AdminTokenInfo>(id ? `/api/garage/tokens/${id}` : null);
}

export function useCreateAdminToken() {
  return useSWRMutation(
    "/api/garage/tokens",
    async (url: string, { arg }: { arg: CreateAdminTokenRequest }) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Failed to create token");
      }
      return res.json() as Promise<CreateAdminTokenResponse>;
    },
  );
}

export function useDeleteAdminToken() {
  return useSWRMutation(
    "/api/garage/tokens",
    async (_url: string, { arg }: { arg: string }) => {
      const res = await fetch(`/api/garage/tokens/${arg}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Failed to delete token");
      }
    },
  );
}
