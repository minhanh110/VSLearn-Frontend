"use client"

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SettingsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false,
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh'
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
      <Header isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt</h1>
          <p className="text-gray-600">Tùy chỉnh trải nghiệm học tập của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notification Settings */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Thông báo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Thông báo push</Label>
                  <p className="text-xs text-gray-500">Nhận thông báo khi có bài học mới</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Cập nhật qua email</Label>
                  <p className="text-xs text-gray-500">Nhận báo cáo tiến độ qua email</p>
                </div>
                <Switch
                  checked={settings.emailUpdates}
                  onCheckedChange={(checked) => handleSettingChange('emailUpdates', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Giao diện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Chế độ tối</Label>
                  <p className="text-xs text-gray-500">Chuyển sang giao diện tối</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Ngôn ngữ</Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Bảo mật</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                Đổi mật khẩu
              </Button>
              <Button variant="outline" className="w-full text-green-600 border-green-600 hover:bg-green-50">
                Xác thực 2 yếu tố
              </Button>
              <Button variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50">
                Xóa tài khoản
              </Button>
            </CardContent>
          </Card>

          {/* Data Settings */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Dữ liệu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                Xuất dữ liệu
              </Button>
              <Button variant="outline" className="w-full text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                Sao lưu tiến độ
              </Button>
              <Button variant="outline" className="w-full text-purple-600 border-purple-600 hover:bg-purple-50">
                Đồng bộ hóa
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700 px-8">
            Lưu cài đặt
          </Button>
        </div>
      </div>

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
} 