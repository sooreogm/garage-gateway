import { PageContainer } from "@/components/layout/page-container";
import { BucketDetail } from "@/components/buckets/bucket-detail";

export default async function BucketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer
      title="Bucket Details"
      description={`Bucket ${id.slice(0, 16)}...`}
    >
      <BucketDetail id={id} />
    </PageContainer>
  );
}
