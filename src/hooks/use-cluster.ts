import useSWR from "swr";
import type { ClusterStatus, ClusterHealth } from "@/lib/garage/types";

export function useClusterStatus() {
  return useSWR<ClusterStatus>("/api/garage/cluster/status");
}

export function useClusterHealth() {
  return useSWR<ClusterHealth>("/api/garage/cluster/health");
}
