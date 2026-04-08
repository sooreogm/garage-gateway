export type EndpointMethod = "GET" | "POST";

export interface EndpointDefinition {
  method: EndpointMethod;
  path: string;
}

export const GARAGE_ENDPOINTS = {
  // Health & diagnostics
  getHealth:        { method: "GET",  path: "/health" },
  getMetrics:       { method: "GET",  path: "/metrics" },
  getClusterStatus: { method: "GET",  path: "/v2/GetClusterStatus" },
  getClusterHealth: { method: "GET",  path: "/v2/GetClusterHealth" },

  // Buckets
  listBuckets:      { method: "GET",  path: "/v2/ListBuckets" },
  createBucket:     { method: "POST", path: "/v2/CreateBucket" },
  getBucketInfo:    { method: "GET",  path: "/v2/GetBucketInfo" },
  updateBucket:     { method: "POST", path: "/v2/UpdateBucket" },

  // Keys
  listKeys:         { method: "GET",  path: "/v2/ListKeys" },
  createKey:        { method: "POST", path: "/v2/CreateKey" },
  getKeyInfo:       { method: "GET",  path: "/v2/GetKeyInfo" },

  // Permissions
  allowBucketKey:   { method: "POST", path: "/v2/AllowBucketKey" },
  denyBucketKey:    { method: "POST", path: "/v2/DenyBucketKey" },

  // Admin tokens
  listAdminTokens:  { method: "GET",  path: "/v2/ListAdminTokens" },
  createAdminToken: { method: "POST", path: "/v2/CreateAdminToken" },
  getAdminTokenInfo:{ method: "GET",  path: "/v2/GetAdminTokenInfo" },
  updateAdminToken: { method: "POST", path: "/v2/UpdateAdminToken" },
  deleteAdminToken: { method: "POST", path: "/v2/DeleteAdminToken" },
} as const satisfies Record<string, EndpointDefinition>;

export type EndpointName = keyof typeof GARAGE_ENDPOINTS;
