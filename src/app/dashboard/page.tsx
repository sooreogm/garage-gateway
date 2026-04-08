import { PageContainer } from "@/components/layout/page-container";
import { ClusterStatusCard } from "@/components/dashboard/cluster-status-card";
import { ClusterHealthCard } from "@/components/dashboard/cluster-health-card";
import { QuickStats } from "@/components/dashboard/quick-stats";

export default function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      description="Garage cluster overview and quick stats"
    >
      <QuickStats />
      <div className="grid gap-4 sm:grid-cols-2">
        <ClusterStatusCard />
        <ClusterHealthCard />
      </div>
    </PageContainer>
  );
}
