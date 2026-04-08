import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <PageContainer title="Login" description="Authentication">
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">
            Authentication is managed via server-side admin token. Session-based login coming soon.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
