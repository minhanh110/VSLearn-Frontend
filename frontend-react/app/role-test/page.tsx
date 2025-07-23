"use client"

import { useUserRole } from '@/hooks/use-user-role'
import { usePageAccess } from '@/hooks/use-page-access'
import { RoleBasedRoute } from '@/components/role-based-route'
import { 
  ViewContentOnly, 
  CreateContentOnly, 
  EditContentOnly, 
  ApproveContentOnly, 
  ManageUsersOnly, 
  SystemSettingsOnly 
} from '@/components/permission-based-content'
import { Button } from '@/components/ui/button'

function RoleTestContent() {
  const { role, loading } = useUserRole()
  const { 
    canAccess,
    hasViewContentPermission,
    hasCreateContentPermission,
    hasEditContentPermission,
    hasApproveContentPermission,
    hasManageUsersPermission,
    hasSystemSettingsPermission,
    pathname 
  } = usePageAccess()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
          🔐 Role & Permission Test
        </h1>

        {/* Current Role Info */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Current User Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Role:</span> 
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">{role || 'guest'}</span>
            </div>
            <div>
              <span className="font-medium">Current Page:</span> 
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 rounded">{pathname}</span>
            </div>
            <div>
              <span className="font-medium">Can Access Current Page:</span> 
              <span className={`ml-2 px-2 py-1 rounded ${canAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {canAccess ? '✅ Yes' : '❌ No'}
              </span>
            </div>
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Permission Matrix</h2>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>View Content</span>
              <span className={hasViewContentPermission ? 'text-green-600' : 'text-red-600'}>
                {hasViewContentPermission ? '✅' : '❌'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>Create Content</span>
              <span className={hasCreateContentPermission ? 'text-green-600' : 'text-red-600'}>
                {hasCreateContentPermission ? '✅' : '❌'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>Edit Content</span>
              <span className={hasEditContentPermission ? 'text-green-600' : 'text-red-600'}>
                {hasEditContentPermission ? '✅' : '❌'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>Approve Content</span>
              <span className={hasApproveContentPermission ? 'text-green-600' : 'text-red-600'}>
                {hasApproveContentPermission ? '✅' : '❌'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>Manage Users</span>
              <span className={hasManageUsersPermission ? 'text-green-600' : 'text-red-600'}>
                {hasManageUsersPermission ? '✅' : '❌'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>System Settings</span>
              <span className={hasSystemSettingsPermission ? 'text-green-600' : 'text-red-600'}>
                {hasSystemSettingsPermission ? '✅' : '❌'}
              </span>
            </div>
          </div>
        </div>

        {/* Permission-Based Content Test */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Permission-Based Content Test</h2>
          <div className="space-y-4">
            <ViewContentOnly>
              <div className="p-4 bg-green-100 border border-green-300 rounded">
                <h3 className="font-semibold text-green-800">✅ View Content Permission</h3>
                <p className="text-green-700">Bạn có quyền xem nội dung này</p>
              </div>
            </ViewContentOnly>

            <CreateContentOnly>
              <div className="p-4 bg-blue-100 border border-blue-300 rounded">
                <h3 className="font-semibold text-blue-800">✅ Create Content Permission</h3>
                <p className="text-blue-700">Bạn có quyền tạo nội dung</p>
                <Button className="mt-2">Tạo nội dung mới</Button>
              </div>
            </CreateContentOnly>

            <EditContentOnly>
              <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
                <h3 className="font-semibold text-yellow-800">✅ Edit Content Permission</h3>
                <p className="text-yellow-700">Bạn có quyền chỉnh sửa nội dung</p>
                <Button className="mt-2">Chỉnh sửa nội dung</Button>
              </div>
            </EditContentOnly>

            <ApproveContentOnly>
              <div className="p-4 bg-purple-100 border border-purple-300 rounded">
                <h3 className="font-semibold text-purple-800">✅ Approve Content Permission</h3>
                <p className="text-purple-700">Bạn có quyền duyệt nội dung</p>
                <Button className="mt-2">Duyệt nội dung</Button>
              </div>
            </ApproveContentOnly>

            <ManageUsersOnly>
              <div className="p-4 bg-indigo-100 border border-indigo-300 rounded">
                <h3 className="font-semibold text-indigo-800">✅ Manage Users Permission</h3>
                <p className="text-indigo-700">Bạn có quyền quản lý người dùng</p>
                <Button className="mt-2">Quản lý người dùng</Button>
              </div>
            </ManageUsersOnly>

            <SystemSettingsOnly>
              <div className="p-4 bg-red-100 border border-red-300 rounded">
                <h3 className="font-semibold text-red-800">✅ System Settings Permission</h3>
                <p className="text-red-700">Bạn có quyền cài đặt hệ thống</p>
                <Button className="mt-2">Cài đặt hệ thống</Button>
              </div>
            </SystemSettingsOnly>
          </div>
        </div>

        {/* Role-Based Route Test */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Role-Based Route Test</h2>
          <div className="space-y-4">
            <RoleBasedRoute allowedRoles={['content-creator', 'general-manager']}>
              <div className="p-4 bg-green-100 border border-green-300 rounded">
                <h3 className="font-semibold text-green-800">✅ Content Creator Route</h3>
                <p className="text-green-700">Bạn có quyền truy cập trang này (Content Creator hoặc General Manager)</p>
              </div>
            </RoleBasedRoute>

            <RoleBasedRoute allowedRoles={['content-approver', 'general-manager']}>
              <div className="p-4 bg-blue-100 border border-blue-300 rounded">
                <h3 className="font-semibold text-blue-800">✅ Content Approver Route</h3>
                <p className="text-blue-700">Bạn có quyền truy cập trang này (Content Approver hoặc General Manager)</p>
              </div>
            </RoleBasedRoute>

            <RoleBasedRoute allowedRoles={['general-manager']}>
              <div className="p-4 bg-purple-100 border border-purple-300 rounded">
                <h3 className="font-semibold text-purple-800">✅ General Manager Route</h3>
                <p className="text-purple-700">Bạn có quyền truy cập trang này (chỉ General Manager)</p>
              </div>
            </RoleBasedRoute>
          </div>
        </div>

        {/* Navigation Test */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Navigation Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => window.location.href = '/create-topic'}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Test Create Topic
            </Button>
            <Button 
              onClick={() => window.location.href = '/content-approver/topics'}
              className="bg-green-500 hover:bg-green-600"
            >
              Test Approve Topics
            </Button>
            <Button 
              onClick={() => window.location.href = '/admin'}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Test Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RoleTestPage() {
  return (
    <RoleBasedRoute allowedRoles={['learner', 'content-creator', 'content-approver', 'general-manager']}>
      <RoleTestContent />
    </RoleBasedRoute>
  )
} 