"use client";

import Link from "next/link";
import { useKey } from "@/hooks/use-keys";
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

export function KeyDetail({ id }: { id: string }) {
  const { data, error, isLoading } = useKey(id);

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
        {error?.message || "Failed to load key details"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm font-medium">{data.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Access Key ID</span>
            <code className="text-sm font-mono">{data.accessKeyId}</code>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Can Create Buckets</span>
            <Badge variant={data.permissions.createBucket ? "default" : "secondary"}>
              {data.permissions.createBucket ? "Yes" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Authorized Buckets</CardTitle>
        </CardHeader>
        <CardContent>
          {data.buckets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This key has no bucket permissions.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bucket</TableHead>
                  <TableHead>Aliases</TableHead>
                  <TableHead>Read</TableHead>
                  <TableHead>Write</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.buckets.map((bucket) => (
                  <TableRow key={bucket.id}>
                    <TableCell>
                      <Link
                        href={`/buckets/${bucket.id}`}
                        className="font-mono text-xs hover:underline"
                      >
                        {bucket.id.slice(0, 16)}...
                      </Link>
                    </TableCell>
                    <TableCell>
                      {bucket.globalAliases.length > 0
                        ? bucket.globalAliases.join(", ")
                        : bucket.localAliases.join(", ") || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={bucket.permissions.read ? "default" : "outline"}
                      >
                        {bucket.permissions.read ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={bucket.permissions.write ? "default" : "outline"}
                      >
                        {bucket.permissions.write ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={bucket.permissions.owner ? "default" : "outline"}
                      >
                        {bucket.permissions.owner ? "Yes" : "No"}
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
