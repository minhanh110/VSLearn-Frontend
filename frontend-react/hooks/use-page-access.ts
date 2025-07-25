import { useUserRole } from './use-user-role'
import { canAccessPage, hasPermission, PERMISSIONS } from '@/utils/permissions'
import { usePathname } from 'next/navigation'

export function usePageAccess() {
  const { role, loading } = useUserRole()
  const pathname = usePathname()

  const canAccess = canAccessPage(role, pathname)
  
  const hasViewContentPermission = hasPermission(role, PERMISSIONS.VIEW_CONTENT)
  const hasCreateContentPermission = hasPermission(role, PERMISSIONS.CREATE_CONTENT)
  const hasEditContentPermission = hasPermission(role, PERMISSIONS.EDIT_CONTENT)
  const hasApproveContentPermission = hasPermission(role, PERMISSIONS.APPROVE_CONTENT)
  const hasManageUsersPermission = hasPermission(role, PERMISSIONS.MANAGE_USERS)
  const hasSystemSettingsPermission = hasPermission(role, PERMISSIONS.SYSTEM_SETTINGS)

  return {
    role,
    loading,
    canAccess,
    hasViewContentPermission,
    hasCreateContentPermission,
    hasEditContentPermission,
    hasApproveContentPermission,
    hasManageUsersPermission,
    hasSystemSettingsPermission,
    pathname,
  }
} 