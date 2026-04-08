import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import type { BucketListItem, BucketInfo, CreateBucketRequest } from "@/lib/garage/types";

export function useBuckets() {
  return useSWR<BucketListItem[]>("/api/garage/buckets");
}

export function useBucket(id: string) {
  return useSWR<BucketInfo>(id ? `/api/garage/buckets/${id}` : null);
}

export function useCreateBucket() {
  return useSWRMutation(
    "/api/garage/buckets",
    async (url: string, { arg }: { arg: CreateBucketRequest }) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Failed to create bucket");
      }
      return res.json() as Promise<BucketInfo>;
    },
  );
}
