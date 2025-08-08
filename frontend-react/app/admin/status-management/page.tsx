"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { toast } from "sonner"

interface StatusOption {
  value: string
  label: string
  description?: string
}

export default function StatusManagementPage() {
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStatus, setEditingStatus] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState({
    value: "",
    label: "",
    description: ""
  })

  // Fetch status options
  useEffect(() => {
    fetchStatusOptions()
  }, [])

  const fetchStatusOptions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/topics/status-options")
      const data = await response.json()
      setStatusOptions(data)
    } catch (error) {
      console.error("Error fetching status options:", error)
      toast.error("Không thể tải danh sách trạng thái")
    } finally {
      setLoading(false)
    }
  }

  const handleAddStatus = async () => {
    if (!newStatus.value || !newStatus.label) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    try {
      const response = await fetch("/topics/status-options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus.value,
          label: newStatus.label,
          description: newStatus.description
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success("Thêm trạng thái mới thành công")
        setNewStatus({ value: "", label: "", description: "" })
        fetchStatusOptions() // Refresh the list
      } else {
        toast.error(result.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error adding status:", error)
      toast.error("Không thể thêm trạng thái mới")
    }
  }

  const handleEditStatus = (status: StatusOption) => {
    setEditingStatus(status.value)
    setNewStatus({
      value: status.value,
      label: status.label,
      description: status.description || ""
    })
  }

  const handleSaveEdit = async () => {
    if (!editingStatus || !newStatus.value || !newStatus.label) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    try {
      // For now, we'll just update the local state
      // In a real implementation, you'd have an API endpoint to update status options
      setStatusOptions(prev => prev.map(status => 
        status.value === editingStatus 
          ? { ...status, label: newStatus.label, description: newStatus.description }
          : status
      ))
      
      setEditingStatus(null)
      setNewStatus({ value: "", label: "", description: "" })
      toast.success("Cập nhật trạng thái thành công")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Không thể cập nhật trạng thái")
    }
  }

  const handleCancelEdit = () => {
    setEditingStatus(null)
    setNewStatus({ value: "", label: "", description: "" })
  }

  const handleDeleteStatus = async (statusValue: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa trạng thái này?")) {
      try {
        // For now, we'll just update the local state
        // In a real implementation, you'd have an API endpoint to delete status options
        setStatusOptions(prev => prev.filter(status => status.value !== statusValue))
        toast.success("Xóa trạng thái thành công")
      } catch (error) {
        console.error("Error deleting status:", error)
        toast.error("Không thể xóa trạng thái")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4">
            QUẢN LÝ TRẠNG THÁI
          </h1>
          <p className="text-gray-600 text-lg">
            Quản lý các trạng thái chủ đề một cách linh hoạt
          </p>
        </div>

        {/* Add New Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm Trạng Thái Mới
            </CardTitle>
            <CardDescription>
              Tạo trạng thái mới để sử dụng cho các chủ đề
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status-value">Mã Trạng Thái</Label>
                <Input
                  id="status-value"
                  placeholder="VD: active, pending, rejected"
                  value={newStatus.value}
                  onChange={(e) => setNewStatus(prev => ({ ...prev, value: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="status-label">Tên Hiển Thị</Label>
                <Input
                  id="status-label"
                  placeholder="VD: Hoạt động, Đang kiểm duyệt"
                  value={newStatus.label}
                  onChange={(e) => setNewStatus(prev => ({ ...prev, label: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="status-description">Mô Tả</Label>
                <Input
                  id="status-description"
                  placeholder="Mô tả chi tiết về trạng thái"
                  value={newStatus.description}
                  onChange={(e) => setNewStatus(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {editingStatus ? (
                <>
                  <Button onClick={handleSaveEdit} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Lưu Thay Đổi
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Hủy
                  </Button>
                </>
              ) : (
                <Button onClick={handleAddStatus} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Thêm Trạng Thái
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Trạng Thái</CardTitle>
            <CardDescription>
              Quản lý các trạng thái hiện có trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-blue-700">Đang tải...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statusOptions.map((status) => (
                  <Card key={status.value} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {status.value}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{status.label}</h3>
                          {status.description && (
                            <p className="text-sm text-gray-600">{status.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditStatus(status)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteStatus(status.value)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
