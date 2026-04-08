"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { useCreateBucket } from "@/hooks/use-buckets";
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
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function CreateBucketDialog() {
  const [open, setOpen] = useState(false);
  const [globalAlias, setGlobalAlias] = useState("");
  const { trigger, isMutating } = useCreateBucket();
  const { mutate } = useSWRConfig();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await trigger({
        globalAlias: globalAlias || undefined,
      });
      toast.success("Bucket created successfully");
      mutate("/api/garage/buckets");
      setGlobalAlias("");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create bucket");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Create Bucket
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Bucket</DialogTitle>
            <DialogDescription>
              Create a new storage bucket. Optionally assign a global alias.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="globalAlias">Global Alias (optional)</Label>
            <Input
              id="globalAlias"
              value={globalAlias}
              onChange={(e) => setGlobalAlias(e.target.value)}
              placeholder="my-bucket"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isMutating}>
              {isMutating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
