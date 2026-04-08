"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { useCreateAdminToken } from "@/hooks/use-tokens";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Plus, Copy, AlertTriangle } from "lucide-react";
import type { CreateAdminTokenResponse } from "@/lib/garage/types";

export function CreateTokenDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [scope, setScope] = useState("");
  const [createdToken, setCreatedToken] = useState<CreateAdminTokenResponse | null>(null);
  const { trigger, isMutating } = useCreateAdminToken();
  const { mutate } = useSWRConfig();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await trigger({
        name: name.trim(),
        scope: scope.trim()
          ? scope.split(",").map((s) => s.trim())
          : ["*"],
      });
      if (result) {
        setCreatedToken(result);
        mutate("/api/garage/tokens");
        toast.success("Admin token created");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create token");
    }
  }

  function handleClose() {
    setOpen(false);
    setName("");
    setScope("");
    setCreatedToken(null);
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Create Token
      </DialogTrigger>
      <DialogContent>
        {createdToken ? (
          <>
            <DialogHeader>
              <DialogTitle>Token Created</DialogTitle>
              <DialogDescription>
                Save the secret token now. It will not be shown again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Copy the secret token below. You will not be able to retrieve it later.
                </AlertDescription>
              </Alert>
              <div>
                <Label>Token ID</Label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
                    {createdToken.id ?? "Not returned by Garage"}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => createdToken.id && copyToClipboard(createdToken.id)}
                    disabled={!createdToken.id}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Secret Token</Label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono break-all">
                    {createdToken.secretToken}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(createdToken.secretToken)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create Admin Token</DialogTitle>
              <DialogDescription>
                Create a new admin API token with specific scope.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="tokenName">Name</Label>
                <Input
                  id="tokenName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="my-admin-token"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tokenScope">Scope (comma-separated, leave empty for all)</Label>
                <Input
                  id="tokenScope"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="ListBuckets, GetBucketInfo, ..."
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isMutating}>
                {isMutating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
