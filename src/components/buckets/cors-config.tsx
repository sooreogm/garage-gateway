"use client";

import { useState, useEffect } from "react";
import { useBucketCors, useUpdateBucketCors, useDeleteBucketCors } from "@/hooks/use-cors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { CorsRule } from "@/lib/garage/types";

const EMPTY_RULE: CorsRule = {
  allowedOrigins: ["*"],
  allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
  allowedHeaders: ["*"],
  exposeHeaders: [],
  maxAgeSeconds: 3600,
};

function CorsRuleEditor({
  rule,
  index,
  onChange,
  onRemove,
}: {
  rule: CorsRule;
  index: number;
  onChange: (index: number, rule: CorsRule) => void;
  onRemove: (index: number) => void;
}) {
  function updateField(field: keyof CorsRule, value: string) {
    if (field === "maxAgeSeconds") {
      onChange(index, { ...rule, maxAgeSeconds: parseInt(value) || 0 });
    } else {
      onChange(index, {
        ...rule,
        [field]: value.split(",").map((s) => s.trim()).filter(Boolean),
      });
    }
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Rule {index + 1}</span>
        <Button variant="ghost" size="icon" onClick={() => onRemove(index)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Allowed Origins (comma-separated)</Label>
          <Input
            value={rule.allowedOrigins.join(", ")}
            onChange={(e) => updateField("allowedOrigins", e.target.value)}
            placeholder="*, https://example.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Allowed Methods (comma-separated)</Label>
          <Input
            value={rule.allowedMethods.join(", ")}
            onChange={(e) => updateField("allowedMethods", e.target.value)}
            placeholder="GET, PUT, POST, DELETE, HEAD"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Allowed Headers (comma-separated)</Label>
          <Input
            value={rule.allowedHeaders.join(", ")}
            onChange={(e) => updateField("allowedHeaders", e.target.value)}
            placeholder="*, Content-Type, Authorization"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Expose Headers (comma-separated)</Label>
          <Input
            value={(rule.exposeHeaders ?? []).join(", ")}
            onChange={(e) => updateField("exposeHeaders", e.target.value)}
            placeholder="ETag, x-amz-request-id"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Max Age (seconds)</Label>
          <Input
            type="number"
            value={rule.maxAgeSeconds ?? 3600}
            onChange={(e) => updateField("maxAgeSeconds", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}

export function CorsConfig({ bucketId }: { bucketId: string }) {
  const { data, error, isLoading, mutate } = useBucketCors(bucketId);
  const { trigger: updateCors, isMutating: saving } = useUpdateBucketCors(bucketId);
  const { trigger: deleteCors, isMutating: deleting } = useDeleteBucketCors(bucketId);
  const [rules, setRules] = useState<CorsRule[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data?.corsRules) {
      setRules(data.corsRules);
      setHasChanges(false);
    }
  }, [data]);

  function handleChange(index: number, rule: CorsRule) {
    const next = [...rules];
    next[index] = rule;
    setRules(next);
    setHasChanges(true);
  }

  function handleRemove(index: number) {
    setRules(rules.filter((_, i) => i !== index));
    setHasChanges(true);
  }

  function handleAdd() {
    setRules([...rules, { ...EMPTY_RULE }]);
    setHasChanges(true);
  }

  async function handleSave() {
    try {
      await updateCors(rules);
      toast.success("CORS configuration saved");
      mutate();
      setHasChanges(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save CORS");
    }
  }

  async function handleDelete() {
    try {
      await deleteCors();
      toast.success("CORS configuration removed");
      setRules([]);
      mutate();
      setHasChanges(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete CORS");
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CORS Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CORS Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">CORS Configuration</CardTitle>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="mr-1 h-3 w-3" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No CORS rules configured. Add a rule to allow cross-origin access.
          </p>
        ) : (
          rules.map((rule, i) => (
            <CorsRuleEditor
              key={i}
              rule={rule}
              index={i}
              onChange={handleChange}
              onRemove={handleRemove}
            />
          ))
        )}

        {(rules.length > 0 || hasChanges) && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving || !hasChanges}>
                {saving ? "Saving..." : "Save CORS"}
              </Button>
              {data?.corsRules && data.corsRules.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Removing..." : "Remove All CORS"}
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
