import { RoleBasedRoute } from "@/components/role-based-route";
import ListRejectedTopicPage from "./list-rejected-topic-page";

export default function Page() {
  return (
    <RoleBasedRoute allowedRoles={['content-creator', 'general-manager']}>
      <ListRejectedTopicPage />
    </RoleBasedRoute>
  );
} 