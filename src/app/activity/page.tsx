import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent } from "@/components/ui/card";

export default function ActivityPage() {
  return (
    <PageContainer
      title="Activity"
      description="Recent operations and cluster events"
    >
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">
            Activity monitoring coming soon.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
