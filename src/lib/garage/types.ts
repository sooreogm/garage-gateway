// ── Cluster ──────────────────────────────────────────────

export interface ClusterHealth {
  status: string;
  knownNodes: number;
  connectedNodes: number;
  storageNodes: number;
  storageNodesUp: number;
  partitions: number;
  partitionsQuorum: number;
  partitionsAllOk: number;
}

export interface PartitionInfo {
  available: number;
  total: number;
}

export interface NodeRole {
  zone: string;
  capacity: number | null;
  tags: string[];
}

export interface NodeInfo {
  id: string;
  garageVersion: string;
  addr: string;
  hostname: string;
  isUp: boolean;
  lastSeenSecsAgo: number | null;
  role: NodeRole | null;
  draining: boolean;
  dataPartition: PartitionInfo | null;
  metadataPartition: PartitionInfo | null;
}

export interface ClusterStatus {
  layoutVersion: number;
  nodes: NodeInfo[];
}

// ── Buckets ──────────────────────────────────────────────

export interface BucketLocalAlias {
  accessKeyId: string;
  alias: string;
}

export interface BucketListItem {
  id: string;
  globalAliases: string[];
  localAliases: BucketLocalAlias[];
}

export interface Permissions {
  read: boolean;
  write: boolean;
  owner: boolean;
}

export interface WebsiteConfig {
  indexDocument: string;
  errorDocument: string | null;
}

export interface BucketKeyPermission {
  accessKeyId: string;
  name: string;
  permissions: Permissions;
  bucketLocalAliases: string[];
}

export interface BucketQuotas {
  maxSize: number | null;
  maxObjects: number | null;
}

export interface BucketInfo {
  id: string;
  globalAliases: string[];
  websiteAccess: boolean;
  websiteConfig: WebsiteConfig | null;
  keys: BucketKeyPermission[];
  objects: number;
  bytes: number;
  unfinishedUploads: number;
  unfinishedMultipartUploads: number;
  unfinishedMultipartUploadParts: number;
  unfinishedMultipartUploadBytes: number;
  quotas: BucketQuotas;
}

export interface CreateBucketRequest {
  globalAlias?: string;
  localAlias?: {
    accessKeyId: string;
    alias: string;
    allow?: Permissions;
  };
}

export interface UpdateBucketRequest {
  websiteAccess?: {
    enabled: boolean;
    indexDocument?: string;
    errorDocument?: string;
  };
  quotas?: BucketQuotas;
}

// ── CORS ─────────────────────────────────────────────────

export interface CorsRule {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposeHeaders?: string[];
  maxAgeSeconds?: number;
}

export interface CorsConfiguration {
  corsRules: CorsRule[];
}

// ── Keys ─────────────────────────────────────────────────

export interface KeyListItem {
  id: string;
  name: string;
}

export interface KeyBucketInfo {
  id: string;
  globalAliases: string[];
  localAliases: string[];
  permissions: Permissions;
}

export interface KeyInfo {
  accessKeyId: string;
  secretAccessKey: string | null;
  name: string;
  permissions: {
    createBucket: boolean;
  };
  buckets: KeyBucketInfo[];
}

export interface CreateKeyRequest {
  name: string;
}

// ── Permissions ──────────────────────────────────────────

export interface BucketKeyPermissionRequest {
  bucketId: string;
  accessKeyId: string;
  permissions: Permissions;
}

// ── Admin Tokens ─────────────────────────────────────────

export interface AdminTokenListItem {
  id: string | null;
  name: string;
  expiration: string | null;
  scope: string[];
}

export interface AdminTokenInfo {
  id: string | null;
  name: string;
  expiration: string | null;
  scope: string[];
}

export interface CreateAdminTokenRequest {
  name: string;
  expiration?: string;
  scope?: string[];
}

export interface CreateAdminTokenResponse extends AdminTokenInfo {
  secretToken: string;
}

export interface UpdateAdminTokenRequest {
  name?: string;
  expiration?: string | null;
  scope?: string[];
}
