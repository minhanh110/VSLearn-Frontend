"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Mail, Phone, User, MapPin, Calendar, Award } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditApproverPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("id")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    userName: "",
    name: "",
    email: "",
    phone: "",
    specialization: "",
    bio: "",
    address: "",
    dateOfBirth: "",
    experience: "",
    education: "",
    certifications: "",
    status: "active",
    userRole: "CONTENT_APPROVER",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const debounceRef = useRef<any>({})

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return
      
    
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`/admin/users/all?search=${encodeURIComponent(value)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = res.data?.content || res.data?.data || [];
      // Loáº¡i bá» chÃ­nh user Ä‘ang edit khá»i check trÃ¹ng
      const filtered = users.filter((u: any) => String(u.id) !== String(userId));
      if (field === 'userName') {
        return filtered.some((u: any) => u.userName === value);
      }
      if (field === 'userEmail' || field === 'email') {
        return filtered.some((u: any) => u.userEmail === value);
      }
      if (field === 'phone' || field === 'phoneNumber') {
        return filtered.some((u: any) => u.phoneNumber === value);
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        
