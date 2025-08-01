import { RoleBasedRoute } from "@/components/role-based-route";
import ListApprovedTopicComponent from "./list-approved-topic-page";

export default function Page() {
  return (
    <RoleBasedRoute allowedRoles={['content-creator', 'content-approver']}>
      < ListApprovedTopicComponent/>
    </RoleBasedRoute>
  );
} 