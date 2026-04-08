import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const garageUrl = process.env.GARAGE_ADMIN_API_URL ?? "Not configured";
  const tokenConfigured = !!process.env.GARAGE_ADMIN_TOKEN;

  return (
    <PageContainer
      title="Settings"
      description="Application configuration and connection info"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Garage Admin API URL</span>
            <code className="text-sm font-mono">{garageUrl}</code>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Admin Token</span>
            <span className="text-sm font-medium">
              {tokenConfigured ? "Configured" : "Not configured"}
            </span>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
