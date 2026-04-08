"use client";

import { useBuckets } from "@/hooks/use-buckets";
import { useKeys } from "@/hooks/use-keys";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Key } from "lucide-react";

export function QuickStats() {
  const { data: buckets, isLoading: bucketsLoading } = useBuckets();
  const { data: keys, isLoading: keysLoading } = useKeys();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Buckets</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {bucketsLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold">{buckets?.length ?? 0}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
          <Key className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {keysLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold">{keys?.length ?? 0}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
