"use client"

import { ReactNode } from 'react'
import { useUserRole, UserRole } from '@/hooks/use-user-role'

interface PermissionBasedContentProps {
  children: ReactNode
  fallback?: ReactNode
}

// Component chỉ hiển thị cho user có quyền xem nội dung
export function ViewContentOnly({ children, fallback }: PermissionBasedContentProps) {
  const { role } = useUserRole()
  
  const hasPermission = role === 'learner' || 
                       role === 'content-creator' || 
                       role === 'content-approver' || 
                       role === 'general-manager'
  
  if (!hasPermission) {
    return fallback || null
  }
  
  return <>{children}</>
}

// Component chỉ hiển thị cho user có quyền tạo nội dung
export function CreateContentOnly({ children, fallback }: PermissionBasedContentProps) {
  const { role } = useUserRole()
  
  const hasPermission = role === 'content-creator' || 
                       role === 'content-approver' || 
                       role === 'general-manager'
  
  if (!hasPermission) {
    return fallback || null
  }
  
  return <>{children}</>
}

// Component chỉ hiển thị cho user có quyền chỉnh sửa nội dung
export function EditContentOnly({ children, fallback }: PermissionBasedContentProps) {
  const { role } = useUserRole()
  
  const hasPermission = role === 'content-creator' || 
                       role === 'content-approver' || 
                       role === 'general-manager'
  
  if (!hasPermission) {
    return fallback || null
  }
  
  return <>{children}</>
}

// Component chỉ hiển thị cho user có quyền phê duyệt nội dung
export function ApproveContentOnly({ children, fallback }: PermissionBasedContentProps) {
  const { role } = useUserRole()
  
  const hasPermission = role === 'content-approver' || 
                       role === 'general-manager'
  
  if (!hasPermission) {
    return fallback || null
  }
  
  return <>{children}</>
}

// Component chỉ hiển thị cho user có quyền quản lý người dùng
export function ManageUsersOnly({ children, fallback }: PermissionBasedContentProps) {
  const { role } = useUserRole()
  
  const hasPermission = role === 'general-manager'
  
  if (!hasPermission) {
    return fallback || null
  }
  
  return <>{children}</>
}

// Component chỉ hiển thị cho user có quyền cài đặt hệ thống
export function SystemSettingsOnly({ children, fallback }: PermissionBasedContentProps) {
  const { role } = useUserRole()
  
  const hasPermission = role === 'general-manager'
  
  if (!hasPermission) {
    return fallback || null
  }
  
  return <>{children}</>
} 