import { PageContainer } from "@/components/layout/page-container";
import { TokenTable } from "@/components/tokens/token-table";
import { CreateTokenDialog } from "@/components/tokens/create-token-dialog";

export default function TokensPage() {
  return (
    <PageContainer
      title="Admin Tokens"
      description="Manage admin API tokens"
      actions={<CreateTokenDialog />}
    >
      <TokenTable />
    </PageContainer>
  );
}
