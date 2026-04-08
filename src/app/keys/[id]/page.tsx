import { PageContainer } from "@/components/layout/page-container";
import { KeyDetail } from "@/components/keys/key-detail";

export default async function KeyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer
      title="Key Details"
      description={`Key ${id}`}
    >
      <KeyDetail id={id} />
    </PageContainer>
  );
}
