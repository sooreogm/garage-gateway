"use client";

import { useClusterHealth } from "@/hooks/use-cluster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function statusVariant(status: string) {
  if (status === "healthy") return "default" as const;
  if (status === "degraded") return "secondary" as const;
  return "destructive" as const;
}

export function ClusterHealthCard() {
  const { data, error, isLoading } = useClusterHealth();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cluster Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cluster Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            {error?.message || "Failed to load cluster health"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cluster Health</CardTitle>
        <Badge variant={statusVariant(data.status)}>
          {data.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Connected Nodes</span>
          <span className="text-sm font-medium">
            {data.connectedNodes} / {data.knownNodes}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Storage Nodes Up</span>
          <span className="text-sm font-medium">
            {data.storageNodesUp} / {data.storageNodes}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Partitions (Quorum)</span>
          <span className="text-sm font-medium">
            {data.partitionsQuorum} / {data.partitions}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Partitions (All OK)</span>
          <span className="text-sm font-medium">
            {data.partitionsAllOk} / {data.partitions}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
