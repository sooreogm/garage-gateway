import useSWRMutation from "swr/mutation";
import type { BucketKeyPermissionRequest, BucketInfo } from "@/lib/garage/types";

async function mutatePermission(
  url: string,
  { arg }: { arg: BucketKeyPermissionRequest },
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Permission update failed");
  }
  return res.json() as Promise<BucketInfo>;
}

export function useAllowBucketKey() {
  return useSWRMutation("/api/garage/permissions/allow", mutatePermission);
}

export function useDenyBucketKey() {
  return useSWRMutation("/api/garage/permissions/deny", mutatePermission);
}
