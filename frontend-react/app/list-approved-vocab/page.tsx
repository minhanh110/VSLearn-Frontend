import { RoleBasedRoute } from "@/components/role-based-route";
import ListApprovedVocabComponent from "./list-approved-vocab-page"

export default function ListApprovedVocabPage() {
   return (
    <RoleBasedRoute allowedRoles={['content-creator', 'content-approver']}>
      < ListApprovedVocabComponent/>
    </RoleBasedRoute>
  );
}

