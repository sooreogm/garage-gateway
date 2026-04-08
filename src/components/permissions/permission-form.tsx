"use client";

import { useState } from "react";
import { useBuckets } from "@/hooks/use-buckets";
import { useKeys } from "@/hooks/use-keys";
import { useAllowBucketKey, useDenyBucketKey } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function PermissionForm() {
  const { data: buckets, isLoading: bucketsLoading } = useBuckets();
  const { data: keys, isLoading: keysLoading } = useKeys();
  const { trigger: allow, isMutating: allowing } = useAllowBucketKey();
  const { trigger: deny, isMutating: denying } = useDenyBucketKey();

  const [bucketId, setBucketId] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [read, setRead] = useState(true);
  const [write, setWrite] = useState(false);
  const [owner, setOwner] = useState(false);

  const isLoading = bucketsLoading || keysLoading;
  const isMutating = allowing || denying;

  async function handleAllow() {
    if (!bucketId || !accessKeyId) {
      toast.error("Select both a bucket and a key");
      return;
    }
    try {
      await allow({
        bucketId,
        accessKeyId,
        permissions: { read, write, owner },
      });
      toast.success("Permissions granted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to grant permissions");
    }
  }

  async function handleDeny() {
    if (!bucketId || !accessKeyId) {
      toast.error("Select both a bucket and a key");
      return;
    }
    try {
      await deny({
        bucketId,
        accessKeyId,
        permissions: { read, write, owner },
      });
      toast.success("Permissions revoked");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to revoke permissions");
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Bucket-Key Permissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Bucket</Label>
            <Select value={bucketId} onValueChange={(v) => setBucketId(v ?? "")}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a bucket" />
              </SelectTrigger>
              <SelectContent>
                {buckets?.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.globalAliases[0] || b.id.slice(0, 16) + "..."}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Key</Label>
            <Select value={accessKeyId} onValueChange={(v) => setAccessKeyId(v ?? "")}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a key" />
              </SelectTrigger>
              <SelectContent>
                {keys?.map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.name} ({k.id.slice(0, 12)}...)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="perm-read">Read</Label>
            <Switch id="perm-read" checked={read} onCheckedChange={setRead} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="perm-write">Write</Label>
            <Switch id="perm-write" checked={write} onCheckedChange={setWrite} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="perm-owner">Owner</Label>
            <Switch id="perm-owner" checked={owner} onCheckedChange={setOwner} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAllow} disabled={isMutating}>
            {allowing ? "Granting..." : "Allow"}
          </Button>
          <Button variant="destructive" onClick={handleDeny} disabled={isMutating}>
            {denying ? "Revoking..." : "Deny"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
