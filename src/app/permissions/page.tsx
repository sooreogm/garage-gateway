import { PageContainer } from "@/components/layout/page-container";
import { PermissionForm } from "@/components/permissions/permission-form";

export default function PermissionsPage() {
  return (
    <PageContainer
      title="Permissions"
      description="Grant or revoke key access to buckets"
    >
      <PermissionForm />
    </PageContainer>
  );
}
