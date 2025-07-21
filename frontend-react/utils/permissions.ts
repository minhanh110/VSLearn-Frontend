import { UserRole } from '@/hooks/use-user-role'

// Permission Matrix
export const PERMISSIONS = {
  VIEW_CONTENT: 'view_content',
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content',
  APPROVE_CONTENT: 'approve_content',
  MANAGE_USERS: 'manage_users',
  SYSTEM_SETTINGS: 'system_settings',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: [PERMISSIONS.VIEW_CONTENT],
  learner: [PERMISSIONS.VIEW_CONTENT],
  'content-creator': [
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
  ],
  'content-approver': [
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.APPROVE_CONTENT,
  ],
  'general-manager': [
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.APPROVE_CONTENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.SYSTEM_SETTINGS,
  ],
}

// Page access permissions
export const PAGE_PERMISSIONS: Record<string, Permission[]> = {
  // Public pages (no authentication required)
  '/': [],
  '/homepage': [],
  '/login': [],
  '/register': [],
  '/dictionary': [PERMISSIONS.VIEW_CONTENT],
  '/flashcard': [PERMISSIONS.VIEW_CONTENT],
  '/practice': [PERMISSIONS.VIEW_CONTENT],
  
  // Learner pages
  '/test': [PERMISSIONS.VIEW_CONTENT],
  '/test-start': [PERMISSIONS.VIEW_CONTENT],
  '/test-result': [PERMISSIONS.VIEW_CONTENT],
  '/feedback': [PERMISSIONS.VIEW_CONTENT],
  '/packages': [PERMISSIONS.VIEW_CONTENT],
  '/settings': [PERMISSIONS.VIEW_CONTENT],
  '/edit-profile': [PERMISSIONS.VIEW_CONTENT],
  '/change-password': [PERMISSIONS.VIEW_CONTENT],
  
  // Content Creator pages
  '/create-topic': [PERMISSIONS.CREATE_CONTENT],
  '/topic-edit': [PERMISSIONS.EDIT_CONTENT],
  '/list-topics': [PERMISSIONS.VIEW_CONTENT],
  '/topic-details': [PERMISSIONS.VIEW_CONTENT],
  '/add-vocabulary': [PERMISSIONS.CREATE_CONTENT],
  '/vocab-edit': [PERMISSIONS.EDIT_CONTENT],
  '/list-vocab': [PERMISSIONS.VIEW_CONTENT],
  '/vocab-detail': [PERMISSIONS.VIEW_CONTENT],
  '/content-creator/topics': [PERMISSIONS.CREATE_CONTENT, PERMISSIONS.EDIT_CONTENT],
  '/content-creator/vocabulary': [PERMISSIONS.CREATE_CONTENT, PERMISSIONS.EDIT_CONTENT],
  '/content-creator/rejected-topics': [PERMISSIONS.VIEW_CONTENT],
  '/content-creator/rejected-vocabulary': [PERMISSIONS.VIEW_CONTENT],
  
  // Content Approver pages
  '/content-approver/topics': [PERMISSIONS.APPROVE_CONTENT],
  '/content-approver/vocabulary': [PERMISSIONS.APPROVE_CONTENT],
  '/content-approver/history': [PERMISSIONS.APPROVE_CONTENT],
  '/content-approver/creators': [PERMISSIONS.APPROVE_CONTENT],
  
  // General Manager pages
  '/admin': [PERMISSIONS.SYSTEM_SETTINGS],
  '/admin/approval': [PERMISSIONS.SYSTEM_SETTINGS],
  '/general-manager/dashboard': [PERMISSIONS.SYSTEM_SETTINGS],
  '/general-manager/users': [PERMISSIONS.MANAGE_USERS],
  '/general-manager/content': [PERMISSIONS.SYSTEM_SETTINGS],
  '/general-manager/revenue': [PERMISSIONS.SYSTEM_SETTINGS],
  '/general-manager/activity': [PERMISSIONS.SYSTEM_SETTINGS],
  '/general-manager/security': [PERMISSIONS.SYSTEM_SETTINGS],
  '/general-manager/permissions': [PERMISSIONS.MANAGE_USERS],
  '/general-manager/analytics': [PERMISSIONS.SYSTEM_SETTINGS],
  '/general-manager/settings': [PERMISSIONS.SYSTEM_SETTINGS],
}

// Helper functions
export function hasPermission(userRole: UserRole | null, permission: Permission): boolean {
  if (!userRole) return false
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

export function hasAnyPermission(userRole: UserRole | null, permissions: Permission[]): boolean {
  if (!userRole) return false
  return permissions.some(permission => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: UserRole | null, permissions: Permission[]): boolean {
  if (!userRole) return false
  return permissions.every(permission => hasPermission(userRole, permission))
}

export function canAccessPage(userRole: UserRole | null, pagePath: string): boolean {
  const requiredPermissions = PAGE_PERMISSIONS[pagePath]
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true // Public page
  }
  return hasAnyPermission(userRole, requiredPermissions)
}

// Role hierarchy for inheritance
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  guest: [],
  learner: ['guest'],
  'content-creator': ['learner', 'guest'],
  'content-approver': ['learner', 'guest'],
  'general-manager': ['content-creator', 'content-approver', 'learner', 'guest'],
}

export function hasRoleOrHigher(userRole: UserRole | null, requiredRole: UserRole): boolean {
  if (!userRole) return false
  if (userRole === requiredRole) return true
  
  const hierarchy = ROLE_HIERARCHY[userRole]
  return hierarchy?.includes(requiredRole) || false
} 