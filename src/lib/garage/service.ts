import { garageRequest } from "./client";
import type {
  ClusterStatus,
  ClusterHealth,
  BucketListItem,
  BucketInfo,
  CreateBucketRequest,
  UpdateBucketRequest,
  KeyListItem,
  KeyInfo,
  CreateKeyRequest,
  BucketKeyPermissionRequest,
  AdminTokenListItem,
  AdminTokenInfo,
  CreateAdminTokenRequest,
  CreateAdminTokenResponse,
  UpdateAdminTokenRequest,
} from "./types";

// ── Health & Diagnostics ─────────────────────────────────

export async function getHealth(): Promise<string> {
  return garageRequest<string>("getHealth");
}

export async function getMetrics(): Promise<string> {
  return garageRequest<string>("getMetrics");
}

export async function getClusterStatus(): Promise<ClusterStatus> {
  return garageRequest<ClusterStatus>("getClusterStatus");
}

export async function getClusterHealth(): Promise<ClusterHealth> {
  return garageRequest<ClusterHealth>("getClusterHealth");
}

// ── Buckets ──────────────────────────────────────────────

export async function listBuckets(): Promise<BucketListItem[]> {
  return garageRequest<BucketListItem[]>("listBuckets");
}

export async function getBucketInfo(id: string): Promise<BucketInfo> {
  return garageRequest<BucketInfo>("getBucketInfo", {
    params: { id },
  });
}

export async function createBucket(
  data: CreateBucketRequest,
): Promise<BucketInfo> {
  return garageRequest<BucketInfo>("createBucket", { body: data });
}

export async function updateBucket(
  id: string,
  data: UpdateBucketRequest,
): Promise<BucketInfo> {
  return garageRequest<BucketInfo>("updateBucket", {
    params: { id },
    body: data,
  });
}

// ── Keys ─────────────────────────────────────────────────

export async function listKeys(): Promise<KeyListItem[]> {
  return garageRequest<KeyListItem[]>("listKeys");
}

export async function getKeyInfo(
  id: string,
  showSecretKey = false,
): Promise<KeyInfo> {
  return garageRequest<KeyInfo>("getKeyInfo", {
    params: { id, ...(showSecretKey ? { showSecretKey: "true" } : {}) },
  });
}

export async function createKey(data: CreateKeyRequest): Promise<KeyInfo> {
  return garageRequest<KeyInfo>("createKey", { body: data });
}

// ── Permissions ──────────────────────────────────────────

export async function allowBucketKey(
  data: BucketKeyPermissionRequest,
): Promise<BucketInfo> {
  return garageRequest<BucketInfo>("allowBucketKey", { body: data });
}

export async function denyBucketKey(
  data: BucketKeyPermissionRequest,
): Promise<BucketInfo> {
  return garageRequest<BucketInfo>("denyBucketKey", { body: data });
}

// ── Admin Tokens ─────────────────────────────────────────

export async function listAdminTokens(): Promise<AdminTokenListItem[]> {
  return garageRequest<AdminTokenListItem[]>("listAdminTokens");
}

export async function createAdminToken(
  data: CreateAdminTokenRequest,
): Promise<CreateAdminTokenResponse> {
  return garageRequest<CreateAdminTokenResponse>("createAdminToken", {
    body: data,
  });
}

export async function getAdminTokenInfo(id: string): Promise<AdminTokenInfo> {
  return garageRequest<AdminTokenInfo>("getAdminTokenInfo", {
    params: { id },
  });
}

export async function updateAdminToken(
  id: string,
  data: UpdateAdminTokenRequest,
): Promise<AdminTokenInfo> {
  return garageRequest<AdminTokenInfo>("updateAdminToken", {
    body: { id, ...data },
  });
}

export async function deleteAdminToken(id: string): Promise<null> {
  return garageRequest<null>("deleteAdminToken", {
    body: { id },
  });
}
