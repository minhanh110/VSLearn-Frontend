"use client"

import { RoleBasedRoute } from "@/components/role-based-route";
import SettingsPage from "./settings-page";

export default function Page() {
  return (
    <RoleBasedRoute allowedRoles={['learner', 'content-creator', 'content-approver', 'general-manager']}>
      <SettingsPage />
    </RoleBasedRoute>
  );
} 