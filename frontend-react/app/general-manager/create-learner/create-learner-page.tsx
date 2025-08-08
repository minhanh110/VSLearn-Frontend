"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Mail, Phone, User, MapPin, Calendar, GraduationCap } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const CreateLearnerPage = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [formData, setFormData] = useState({
    userName: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    learningGoal: "",
    currentLevel: "",
    preferredLearningStyle: "",
    notes: "",
    status: "active",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Há» tÃªn lÃ  báº¯t buá»™c"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email lÃ  báº¯t buá»™c"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email khÃ´ng há»£p lá»‡"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Sá»‘ Ä‘iá»‡n thoáº¡i lÃ  báº¯t buá»™c"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng há»£p lá»‡"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        
        } else {
          alert(res.data.message || "Táº¡o há»c viÃªn tháº¥t báº¡i");
        }
      } catch (err: any) {
        alert(err.response?.data?.message || err.message || "CÃ³ lá»—i xáº£y ra")
      }
    }
  }

  const checkDuplicate = async (field: string, value: string) => {
    if (!value) return false;
    
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`/admin/users/all?search=${encodeURIComponent(value)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = res.data?.content || res.data?.data || [];
      if (field === 'userName') {
        return users.some((u: any) => u.userName === value);
      }
      if (field === 'userEmail' || field === 'email') {
        return users.some((u: any) => u.userEmail === value);
      }
      if (field === 'phone' || field === 'phoneNumber') {
        return users.some((u: any) => u.phoneNumber === value);
      }
      return false;
    } catch {
      return false;
    }
  };

  const debounceRef = useRef<any>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    // Kiá»ƒm tra trÃ¹ng userName, email, phone
    if (["userName", "email", "phone"].includes(field)) {
      if (debounceRef.current[field]) clearTimeout(debounceRef.current[field]);
      debounceRef.current[field] = setTimeout(async () => {
        const isDup = await checkDuplicate(field, value);
        if (isDup) {
          setErrors((prev) => ({ ...prev, [field]: `${field === 'userName' ? 'TÃªn Ä‘Äƒng nháº­p' : field === 'email' ? 'Email' : 'Sá»‘ Ä‘iá»‡n thoáº¡i'} Ä‘Ã£ tá»“n táº¡i` }));
        }
      }, 500);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>

      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      <main className="pt-20 pb-20 lg:pb-4 px-2 sm:px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/general-manager/learners")}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay láº¡i danh sÃ¡ch
              </Button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Image
                  src="/images/whale-character.png"
                  alt="Whale"
                  width={32}
                  height={32}
                  className="animate-bounce sm:w-10 sm:h-10"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Táº¡o há»c viÃªn má»›i
                  </h1>
                  <p className="text-sm sm:text-base text-blue-600">ThÃªm há»c viÃªn má»›i vÃ o há»‡ thá»‘ng</p>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base sm:text-lg font-semibold text-blue-900">ThÃ´ng tin cÃ¡ nhÃ¢n</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="userName" className="text-gray-700 font-medium">
                        TÃªn Ä‘Äƒng nháº­p *
                      </Label>
                      <Input
                        id="userName"
                        value={formData.userName}
                        onChange={(e) => handleInputChange("userName", e.target.value)}
                        placeholder="Nháº­p tÃªn Ä‘Äƒng nháº­p"
                        className={`border-blue-200 focus:border-blue-400 ${errors.userName ? "border-red-300" : ""}`}
                      />
                      {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Há» vÃ  tÃªn *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nháº­p há» vÃ  tÃªn"
                        className={`border-blue-200 focus:border-blue-400 ${errors.name ? "border-red-300" : ""}`}
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Nháº­p Ä‘á»‹a chá»‰ email"
                          className={`pl-10 border-blue-200 focus:border-blue-400 ${errors.email ? "border-red-300" : ""}`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Sá»‘ Ä‘iá»‡n thoáº¡i *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Nháº­p sá»‘ Ä‘iá»‡n thoáº¡i"
                          className={`pl-10 border-blue-200 focus:border-blue-400 ${errors.phone ? "border-red-300" : ""}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
                        NgÃ y sinh
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          className="pl-10 border-blue-200 focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700 font-medium">
                      Äá»‹a chá»‰
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Nháº­p Ä‘á»‹a chá»‰"
                        className="pl-10 border-blue-200 focus:border-blue-400 min-h-[60px] sm:min-h-[80px]"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Information */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base sm:text-lg font-semibold text-blue-900">ThÃ´ng tin há»c táº­p</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentLevel" className="text-gray-700 font-medium">
                        TrÃ¬nh Ä‘á»™ hiá»‡n táº¡i
                      </Label>
                      <Select
                        value={formData.currentLevel}
                        onValueChange={(value) => handleInputChange("currentLevel", value)}
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Chá»n trÃ¬nh Ä‘á»™" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">NgÆ°á»i má»›i báº¯t Ä‘áº§u</SelectItem>
                          <SelectItem value="elementary">SÆ¡ cáº¥p</SelectItem>
                          <SelectItem value="intermediate">Trung cáº¥p</SelectItem>
                          <SelectItem value="advanced">NÃ¢ng cao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredLearningStyle" className="text-gray-700 font-medium">
                        Phong cÃ¡ch há»c táº­p
                      </Label>
                      <Select
                        value={formData.preferredLearningStyle}
                        onValueChange={(value) => handleInputChange("preferredLearningStyle", value)}
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Chá»n phong cÃ¡ch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visual">Há»c qua hÃ¬nh áº£nh</SelectItem>
                          <SelectItem value="auditory">Há»c qua Ã¢m thanh</SelectItem>
                          <SelectItem value="kinesthetic">Há»c qua thá»±c hÃ nh</SelectItem>
                          <SelectItem value="mixed">Káº¿t há»£p</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learningGoal" className="text-gray-700 font-medium">
                      Má»¥c tiÃªu há»c táº­p
                    </Label>
                    <Textarea
                      id="learningGoal"
                      value={formData.learningGoal}
                      onChange={(e) => handleInputChange("learningGoal", e.target.value)}
                      placeholder="MÃ´ táº£ má»¥c tiÃªu há»c táº­p cá»§a há»c viÃªn"
                      className="border-blue-200 focus:border-blue-400 min-h-[60px] sm:min-h-[80px]"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-700 font-medium">
                      Ghi chÃº
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Ghi chÃº thÃªm vá» há»c viÃªn (tÃ¬nh tráº¡ng sá»©c khá»e, sá»Ÿ thÃ­ch, v.v.)"
                      className="border-blue-200 focus:border-blue-400 min-h-[80px] sm:min-h-[100px]"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <h2 className="text-base sm:text-lg font-semibold text-blue-900">Tráº¡ng thÃ¡i</h2>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700 font-medium">
                      Tráº¡ng thÃ¡i hoáº¡t Ä‘á»™ng
                    </Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            Äang hoáº¡t Ä‘á»™ng
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            KhÃ´ng hoáº¡t Ä‘á»™ng
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/general-manager/learners")}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 w-full sm:w-auto order-2 sm:order-1"
                >
                  Há»§y bá»
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg w-full sm:w-auto order-1 sm:order-2"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Táº¡o há»c viÃªn
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Dialog thÃ´ng bÃ¡o thÃ nh cÃ´ng */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <div className="text-green-600 text-2xl mb-2">âœ”</div>
            <div className="font-semibold mb-2">Táº¡o há»c viÃªn thÃ nh cÃ´ng!</div>
            <div className="mb-4 text-gray-700">Máº­t kháº©u máº·c Ä‘á»‹nh: <b>123456</b></div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => router.push("/general-manager/learners")}>OK</button>
          </div>
        </div>
      )}

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <ToastContainer position="top-center" autoClose={1200} />
    </div>
  )
}

export default CreateLearnerPage


