"use client";

import Link from "next/link";
import { useKeys } from "@/hooks/use-keys";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function KeyTable() {
  const { data, error, isLoading } = useKeys();

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
        No keys found. Create one to get started.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Key ID</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((key) => (
          <TableRow key={key.id}>
            <TableCell>
              <Link
                href={`/keys/${key.id}`}
                className="font-mono text-sm hover:underline"
              >
                {key.id}
              </Link>
            </TableCell>
            <TableCell>{key.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
