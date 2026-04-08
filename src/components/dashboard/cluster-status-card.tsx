"use client";

import { useClusterStatus } from "@/hooks/use-cluster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function ClusterStatusCard() {
  const { data, error, isLoading } = useClusterStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cluster Status</CardTitle>
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
          <CardTitle>Cluster Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            {error?.message || "Failed to load cluster status"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cluster Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Garage Version</span>
          <Badge variant="secondary">
            {data.nodes[0]?.garageVersion ?? "Unknown"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Layout Version</span>
          <span className="text-sm font-medium">{data.layoutVersion}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Nodes</span>
          <span className="text-sm font-medium">{data.nodes.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Nodes Online</span>
          <span className="text-sm font-medium">
            {data.nodes.filter((n) => n.isUp).length} / {data.nodes.length}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
