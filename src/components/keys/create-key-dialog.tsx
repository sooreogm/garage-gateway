"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { useCreateKey } from "@/hooks/use-keys";
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
import type { KeyInfo } from "@/lib/garage/types";

export function CreateKeyDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [createdKey, setCreatedKey] = useState<KeyInfo | null>(null);
  const { trigger, isMutating } = useCreateKey();
  const { mutate } = useSWRConfig();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await trigger({ name: name.trim() });
      if (result) {
        setCreatedKey(result);
        mutate("/api/garage/keys");
        toast.success("Key created successfully");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create key");
    }
  }

  function handleClose() {
    setOpen(false);
    setName("");
    setCreatedKey(null);
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Create Key
      </DialogTrigger>
      <DialogContent>
        {createdKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Key Created</DialogTitle>
              <DialogDescription>
                Save the secret access key now. It will not be shown again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Copy the secret access key below. You will not be able to retrieve it later.
                </AlertDescription>
              </Alert>
              <div>
                <Label>Access Key ID</Label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
                    {createdKey.accessKeyId}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(createdKey.accessKeyId)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {createdKey.secretAccessKey && (
                <div>
                  <Label>Secret Access Key</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono break-all">
                      {createdKey.secretAccessKey}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(createdKey.secretAccessKey!)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create Key</DialogTitle>
              <DialogDescription>
                Create a new API access key.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="my-app-key"
                className="mt-2"
                required
              />
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
