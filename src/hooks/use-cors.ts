import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import type { CorsRule, CorsConfiguration } from "@/lib/garage/types";

export function useBucketCors(bucketId: string) {
  return useSWR<CorsConfiguration>(
    bucketId ? `/api/garage/buckets/${bucketId}/cors` : null,
  );
}

export function useUpdateBucketCors(bucketId: string) {
  return useSWRMutation(
    `/api/garage/buckets/${bucketId}/cors`,
    async (url: string, { arg }: { arg: CorsRule[] }) => {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ corsRules: arg }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Failed to update CORS");
      }
      return res.json();
    },
  );
}

export function useDeleteBucketCors(bucketId: string) {
  return useSWRMutation(
    `/api/garage/buckets/${bucketId}/cors`,
    async (url: string) => {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Failed to delete CORS");
      }
    },
  );
}
