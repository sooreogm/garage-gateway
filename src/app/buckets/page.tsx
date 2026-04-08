import { PageContainer } from "@/components/layout/page-container";
import { BucketTable } from "@/components/buckets/bucket-table";
import { CreateBucketDialog } from "@/components/buckets/create-bucket-dialog";

export default function BucketsPage() {
  return (
    <PageContainer
      title="Buckets"
      description="Manage storage buckets"
      actions={<CreateBucketDialog />}
    >
      <BucketTable />
    </PageContainer>
  );
}
