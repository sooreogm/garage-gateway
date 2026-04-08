"use client";

import Link from "next/link";
import { useBuckets } from "@/hooks/use-buckets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function BucketTable() {
  const { data, error, isLoading } = useBuckets();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error.message}</p>;
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No buckets found. Create one to get started.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bucket ID</TableHead>
          <TableHead>Global Aliases</TableHead>
          <TableHead>Local Aliases</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((bucket) => (
          <TableRow key={bucket.id}>
            <TableCell>
              <Link
                href={`/buckets/${bucket.id}`}
                className="font-mono text-sm hover:underline"
              >
                {bucket.id.slice(0, 16)}...
              </Link>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {bucket.globalAliases.length > 0 ? (
                  bucket.globalAliases.map((alias) => (
                    <Badge key={alias} variant="secondary">
                      {alias}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {bucket.localAliases.length > 0
                  ? bucket.localAliases.map((la) => la.alias).join(", ")
                  : "-"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
