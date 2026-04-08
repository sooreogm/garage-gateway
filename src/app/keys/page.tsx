import { PageContainer } from "@/components/layout/page-container";
import { KeyTable } from "@/components/keys/key-table";
import { CreateKeyDialog } from "@/components/keys/create-key-dialog";

export default function KeysPage() {
  return (
    <PageContainer
      title="Keys"
      description="Manage API access keys"
      actions={<CreateKeyDialog />}
    >
      <KeyTable />
    </PageContainer>
  );
}
