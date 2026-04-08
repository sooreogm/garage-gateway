"use client";

import { useAdminTokens, useDeleteAdminToken } from "@/hooks/use-tokens";
import { useSWRConfig } from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function TokenTable() {
  const { data, error, isLoading } = useAdminTokens();
  const { trigger: deleteToken } = useDeleteAdminToken();
  const { mutate } = useSWRConfig();

  async function handleDelete(id: string) {
    try {
      await deleteToken(id);
      toast.success("Token deleted");
      mutate("/api/garage/tokens");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete token");
    }
  }

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
        No admin tokens found.
      </p>
    );
  }

  function getTokenLabel(id: string | null) {
    return id ? `${id.slice(0, 16)}...` : "Daemon configuration";
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Scope</TableHead>
          <TableHead>Expiration</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((token) => (
          <TableRow key={token.id ?? `config:${token.name}`}>
            <TableCell className="font-mono text-xs">
              {getTokenLabel(token.id)}
            </TableCell>
            <TableCell>{token.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {token.scope.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-sm">
              {token.expiration ?? "Never"}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => token.id && handleDelete(token.id)}
                disabled={!token.id}
                title={token.id ? "Delete token" : "This token is managed in the Garage daemon configuration"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
