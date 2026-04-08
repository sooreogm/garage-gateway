"use client";

import { useBucket } from "@/hooks/use-buckets";
import { CorsConfig } from "@/components/buckets/cors-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function BucketDetail({ id }: { id: string }) {
  const { data, error, isLoading } = useBucket(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-destructive">
        {error?.message || "Failed to load bucket details"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Objects</span>
              <span className="text-sm font-medium">{data.objects}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Size</span>
              <span className="text-sm font-medium">{formatBytes(data.bytes)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Unfinished Uploads</span>
              <span className="text-sm font-medium">{data.unfinishedUploads}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Website Access</span>
              <Badge variant={data.websiteAccess ? "default" : "secondary"}>
                {data.websiteAccess ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Max Size Quota</span>
              <span className="text-sm font-medium">
                {data.quotas.maxSize ? formatBytes(data.quotas.maxSize) : "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Max Objects Quota</span>
              <span className="text-sm font-medium">
                {data.quotas.maxObjects ?? "None"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aliases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.globalAliases.map((alias) => (
              <Badge key={alias} variant="secondary">
                {alias}
              </Badge>
            ))}
            {data.globalAliases.length === 0 && (
              <span className="text-sm text-muted-foreground">No aliases</span>
            )}
          </div>
        </CardContent>
      </Card>

      <CorsConfig bucketId={id} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Authorized Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {data.keys.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No keys have access to this bucket.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key Name</TableHead>
                  <TableHead>Access Key ID</TableHead>
                  <TableHead>Read</TableHead>
                  <TableHead>Write</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.keys.map((key) => (
                  <TableRow key={key.accessKeyId}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {key.accessKeyId}
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.permissions.read ? "default" : "outline"}>
                        {key.permissions.read ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.permissions.write ? "default" : "outline"}>
                        {key.permissions.write ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.permissions.owner ? "default" : "outline"}>
                        {key.permissions.owner ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
