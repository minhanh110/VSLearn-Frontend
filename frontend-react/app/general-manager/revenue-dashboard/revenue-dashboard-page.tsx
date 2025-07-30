"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { Users, ShoppingCart, TrendingUp, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Function to generate random colors
const generateRandomColor = () => {
  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6366F1",
    "#14B8A6",
    "#F59E0B",
    "#DC2626",
    "#7C3AED",
    "#059669",
    "#D97706",
    "#B91C1C",
    "#7C2D12",
    "#365314",
    "#1E40AF",
    "#BE185D",
    "#9333EA",
    "#C2410C",
    "#166534",
    "#1E3A8A",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Function to assign random colors to packages
const assignRandomColors = (packages: any[]) => {
  return packages.map((pkg) => ({
    ...pkg,
    color: generateRandomColor(),
  }))
}

// Function to get weeks for a specific month and year
const getWeeksForMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()

  const weeks = []
  let weekStart = 1
  let weekNumber = 1

  while (weekStart <= daysInMonth) {
    const weekEnd = Math.min(weekStart + 6, daysInMonth)
    weeks.push({
      value: `${weekStart}-${weekEnd}`,
      label: `Tuần ${weekNumber} (${weekStart}-${weekEnd})`,
      start: weekStart,
      end: weekEnd,
    })
    weekStart = weekEnd + 1
    weekNumber++
  }

  return weeks
}

// Mock revenue data structure
const revenueData = {
  all: [
    { period: "2022", revenue: 150000000 },
    { period: "2023", revenue: 200000000 },
    { period: "2024", revenue: 283000000 },
    { period: "2025", revenue: 339000000 },
  ],
  2024: {
    all: [
      { period: "T1", revenue: 15000000 },
      { period: "T2", revenue: 18000000 },
      { period: "T3", revenue: 22000000 },
      { period: "T4", revenue: 19000000 },
      { period: "T5", revenue: 25000000 },
      { period: "T6", revenue: 28000000 },
      { period: "T7", revenue: 24000000 },
      { period: "T8", revenue: 30000000 },
      { period: "T9", revenue: 26000000 },
      { period: "T10", revenue: 32000000 },
      { period: "T11", revenue: 29000000 },
      { period: "T12", revenue: 35000000 },
    ],
    1: {
      all: [
        { period: "1-7", revenue: 3500000 },
        { period: "8-14", revenue: 4200000 },
        { period: "15-21", revenue: 3800000 },
        { period: "22-28", revenue: 2800000 },
        { period: "29-31", revenue: 700000 },
      ],
    },
    2: {
      all: [
        { period: "1-7", revenue: 4000000 },
        { period: "8-14", revenue: 4800000 },
        { period: "15-21", revenue: 4200000 },
        { period: "22-28", revenue: 5000000 },
      ],
    },
    3: {
      all: [
        { period: "1-7", revenue: 5200000 },
        { period: "8-14", revenue: 5800000 },
        { period: "15-21", revenue: 5500000 },
        { period: "22-28", revenue: 4800000 },
        { period: "29-31", revenue: 700000 },
      ],
    },
    4: {
      all: [
        { period: "1-7", revenue: 4500000 },
        { period: "8-14", revenue: 5000000 },
        { period: "15-21", revenue: 4800000 },
        { period: "22-28", revenue: 4200000 },
        { period: "29-30", revenue: 500000 },
      ],
    },
    5: {
      all: [
        { period: "1-7", revenue: 6000000 },
        { period: "8-14", revenue: 6500000 },
        { period: "15-21", revenue: 6200000 },
        { period: "22-28", revenue: 5800000 },
        { period: "29-31", revenue: 500000 },
      ],
    },
    6: {
      all: [
        { period: "1-7", revenue: 6800000 },
        { period: "8-14", revenue: 7200000 },
        { period: "15-21", revenue: 7000000 },
        { period: "22-28", revenue: 6500000 },
        { period: "29-30", revenue: 500000 },
      ],
    },
  },
  2025: {
    all: [
      { period: "T1", revenue: 18000000 },
      { period: "T2", revenue: 21000000 },
      { period: "T3", revenue: 25000000 },
      { period: "T4", revenue: 22000000 },
      { period: "T5", revenue: 28000000 },
      { period: "T6", revenue: 31000000 },
      { period: "T7", revenue: 27000000 },
      { period: "T8", revenue: 33000000 },
      { period: "T9", revenue: 29000000 },
      { period: "T10", revenue: 35000000 },
      { period: "T11", revenue: 32000000 },
      { period: "T12", revenue: 38000000 },
    ],
    1: {
      all: [
        { period: "1-7", revenue: 4200000 },
        { period: "8-14", revenue: 4800000 },
        { period: "15-21", revenue: 4500000 },
        { period: "22-28", revenue: 4000000 },
        { period: "29-31", revenue: 500000 },
      ],
    },
    2: {
      all: [
        { period: "1-7", revenue: 4800000 },
        { period: "8-14", revenue: 5500000 },
        { period: "15-21", revenue: 5200000 },
        { period: "22-28", revenue: 5500000 },
      ],
    },
    3: {
      all: [
        { period: "1-7", revenue: 6000000 },
        { period: "8-14", revenue: 6500000 },
        { period: "15-21", revenue: 6200000 },
        { period: "22-28", revenue: 5800000 },
        { period: "29-31", revenue: 500000 },
      ],
    },
    4: {
      all: [
        { period: "1-7", revenue: 5200000 },
        { period: "8-14", revenue: 5800000 },
        { period: "15-21", revenue: 5500000 },
        { period: "22-28", revenue: 5000000 },
        { period: "29-30", revenue: 500000 },
      ],
    },
    5: {
      all: [
        { period: "1-7", revenue: 6800000 },
        { period: "8-14", revenue: 7200000 },
        { period: "15-21", revenue: 7000000 },
        { period: "22-28", revenue: 6500000 },
        { period: "29-31", revenue: 500000 },
      ],
    },
    6: {
      all: [
        { period: "1-7", revenue: 7500000 },
        { period: "8-14", revenue: 8000000 },
        { period: "15-21", revenue: 7800000 },
        { period: "22-28", revenue: 7200000 },
        { period: "29-30", revenue: 500000 },
      ],
    },
  },
}

// Mock package sales data (without predefined colors)
const packageSalesData = {
  all: [
    { name: "Gói 1 Tháng", value: 5200 },
    { name: "Gói 3 Tháng", value: 12800 },
    { name: "Gói 6 Tháng", value: 7300 },
    { name: "Gói 12 Tháng", value: 3750 },
    { name: "Gói Premium", value: 2050 },
  ],
  2024: {
    all: [
      { name: "Gói 1 Tháng", value: 1200 },
      { name: "Gói 3 Tháng", value: 2800 },
      { name: "Gói 6 Tháng", value: 1500 },
      { name: "Gói 12 Tháng", value: 800 },
      { name: "Gói Premium", value: 450 },
    ],
    1: {
      all: [
        { name: "Gói 1 Tháng", value: 120 },
        { name: "Gói 3 Tháng", value: 180 },
        { name: "Gói 6 Tháng", value: 95 },
        { name: "Gói 12 Tháng", value: 45 },
      ],
      "1-7": [
        { name: "Gói 1 Tháng", value: 25 },
        { name: "Gói 3 Tháng", value: 35 },
        { name: "Gói 6 Tháng", value: 18 },
        { name: "Gói 12 Tháng", value: 8 },
      ],
      "8-14": [
        { name: "Gói 1 Tháng", value: 30 },
        { name: "Gói 3 Tháng", value: 42 },
        { name: "Gói 6 Tháng", value: 22 },
        { name: "Gói 12 Tháng", value: 12 },
      ],
      "15-21": [
        { name: "Gói 1 Tháng", value: 28 },
        { name: "Gói 3 Tháng", value: 38 },
        { name: "Gói 6 Tháng", value: 20 },
        { name: "Gói 12 Tháng", value: 10 },
      ],
      "22-28": [
        { name: "Gói 1 Tháng", value: 25 },
        { name: "Gói 3 Tháng", value: 35 },
        { name: "Gói 6 Tháng", value: 18 },
        { name: "Gói 12 Tháng", value: 8 },
      ],
      "29-31": [
        { name: "Gói 1 Tháng", value: 12 },
        { name: "Gói 3 Tháng", value: 30 },
        { name: "Gói 6 Tháng", value: 17 },
        { name: "Gói 12 Tháng", value: 7 },
      ],
    },
    2: {
      all: [
        { name: "Gói 1 Tháng", value: 140 },
        { name: "Gói 3 Tháng", value: 200 },
        { name: "Gói 6 Tháng", value: 110 },
        { name: "Gói 12 Tháng", value: 55 },
      ],
      "1-7": [
        { name: "Gói 1 Tháng", value: 32 },
        { name: "Gói 3 Tháng", value: 45 },
        { name: "Gói 6 Tháng", value: 25 },
        { name: "Gói 12 Tháng", value: 12 },
      ],
      "8-14": [
        { name: "Gói 1 Tháng", value: 38 },
        { name: "Gói 3 Tháng", value: 52 },
        { name: "Gói 6 Tháng", value: 28 },
        { name: "Gói 12 Tháng", value: 15 },
      ],
      "15-21": [
        { name: "Gói 1 Tháng", value: 35 },
        { name: "Gói 3 Tháng", value: 48 },
        { name: "Gói 6 Tháng", value: 26 },
        { name: "Gói 12 Tháng", value: 13 },
      ],
      "22-28": [
        { name: "Gói 1 Tháng", value: 35 },
        { name: "Gói 3 Tháng", value: 55 },
        { name: "Gói 6 Tháng", value: 31 },
        { name: "Gói 12 Tháng", value: 15 },
      ],
    },
    3: {
      all: [
        { name: "Gói 1 Tháng", value: 160 },
        { name: "Gói 3 Tháng", value: 240 },
        { name: "Gói 6 Tháng", value: 130 },
        { name: "Gói 12 Tháng", value: 70 },
      ],
      "1-7": [
        { name: "Gói 1 Tháng", value: 38 },
        { name: "Gói 3 Tháng", value: 55 },
        { name: "Gói 6 Tháng", value: 30 },
        { name: "Gói 12 Tháng", value: 15 },
      ],
      "8-14": [
        { name: "Gói 1 Tháng", value: 42 },
        { name: "Gói 3 Tháng", value: 62 },
        { name: "Gói 6 Tháng", value: 35 },
        { name: "Gói 12 Tháng", value: 18 },
      ],
      "15-21": [
        { name: "Gói 1 Tháng", value: 40 },
        { name: "Gói 3 Tháng", value: 58 },
        { name: "Gói 6 Tháng", value: 32 },
        { name: "Gói 12 Tháng", value: 17 },
      ],
      "22-28": [
        { name: "Gói 1 Tháng", value: 30 },
        { name: "Gói 3 Tháng", value: 45 },
        { name: "Gói 6 Tháng", value: 23 },
        { name: "Gói 12 Tháng", value: 12 },
      ],
      "29-31": [
        { name: "Gói 1 Tháng", value: 10 },
        { name: "Gói 3 Tháng", value: 20 },
        { name: "Gói 6 Tháng", value: 10 },
        { name: "Gói 12 Tháng", value: 8 },
      ],
    },
  },
  2025: {
    all: [
      { name: "Gói 1 Tháng", value: 1400 },
      { name: "Gói 3 Tháng", value: 3200 },
      { name: "Gói 6 Tháng", value: 1800 },
      { name: "Gói 12 Tháng", value: 950 },
      { name: "Gói Premium", value: 600 },
    ],
    1: {
      all: [
        { name: "Gói 1 Tháng", value: 140 },
        { name: "Gói 3 Tháng", value: 220 },
        { name: "Gói 6 Tháng", value: 115 },
        { name: "Gói 12 Tháng", value: 55 },
      ],
      "1-7": [
        { name: "Gói 1 Tháng", value: 30 },
        { name: "Gói 3 Tháng", value: 45 },
        { name: "Gói 6 Tháng", value: 22 },
        { name: "Gói 12 Tháng", value: 10 },
      ],
      "8-14": [
        { name: "Gói 1 Tháng", value: 35 },
        { name: "Gói 3 Tháng", value: 55 },
        { name: "Gói 6 Tháng", value: 28 },
        { name: "Gói 12 Tháng", value: 15 },
      ],
      "15-21": [
        { name: "Gói 1 Tháng", value: 32 },
        { name: "Gói 3 Tháng", value: 50 },
        { name: "Gói 6 Tháng", value: 25 },
        { name: "Gói 12 Tháng", value: 12 },
      ],
      "22-28": [
        { name: "Gói 1 Tháng", value: 33 },
        { name: "Gói 3 Tháng", value: 50 },
        { name: "Gói 6 Tháng", value: 25 },
        { name: "Gói 12 Tháng", value: 10 },
      ],
      "29-31": [
        { name: "Gói 1 Tháng", value: 10 },
        { name: "Gói 3 Tháng", value: 20 },
        { name: "Gói 6 Tháng", value: 15 },
        { name: "Gói 12 Tháng", value: 8 },
      ],
    },
    2: {
      all: [
        { name: "Gói 1 Tháng", value: 160 },
        { name: "Gói 3 Tháng", value: 250 },
        { name: "Gói 6 Tháng", value: 135 },
        { name: "Gói 12 Tháng", value: 65 },
      ],
      "1-7": [
        { name: "Gói 1 Tháng", value: 35 },
        { name: "Gói 3 Tháng", value: 52 },
        { name: "Gói 6 Tháng", value: 28 },
        { name: "Gói 12 Tháng", value: 12 },
      ],
      "8-14": [
        { name: "Gói 1 Tháng", value: 42 },
        { name: "Gói 3 Tháng", value: 65 },
        { name: "Gói 6 Tháng", value: 35 },
        { name: "Gói 12 Tháng", value: 18 },
      ],
      "15-21": [
        { name: "Gói 1 Tháng", value: 38 },
        { name: "Gói 3 Tháng", value: 58 },
        { name: "Gói 6 Tháng", value: 32 },
        { name: "Gói 12 Tháng", value: 15 },
      ],
      "22-28": [
        { name: "Gói 1 Tháng", value: 45 },
        { name: "Gói 3 Tháng", value: 75 },
        { name: "Gói 6 Tháng", value: 40 },
        { name: "Gói 12 Tháng", value: 20 },
      ],
    },
    3: {
      all: [
        { name: "Gói 1 Tháng", value: 180 },
        { name: "Gói 3 Tháng", value: 280 },
        { name: "Gói 6 Tháng", value: 150 },
        { name: "Gói 12 Tháng", value: 80 },
      ],
      "1-7": [
        { name: "Gói 1 Tháng", value: 42 },
        { name: "Gói 3 Tháng", value: 65 },
        { name: "Gói 6 Tháng", value: 35 },
        { name: "Gói 12 Tháng", value: 18 },
      ],
      "8-14": [
        { name: "Gói 1 Tháng", value: 48 },
        { name: "Gói 3 Tháng", value: 72 },
        { name: "Gói 6 Tháng", value: 38 },
        { name: "Gói 12 Tháng", value: 22 },
      ],
      "15-21": [
        { name: "Gói 1 Tháng", value: 45 },
        { name: "Gói 3 Tháng", value: 68 },
        { name: "Gói 6 Tháng", value: 37 },
        { name: "Gói 12 Tháng", value: 20 },
      ],
      "22-28": [
        { name: "Gói 1 Tháng", value: 35 },
        { name: "Gói 3 Tháng", value: 55 },
        { name: "Gói 6 Tháng", value: 25 },
        { name: "Gói 12 Tháng", value: 12 },
      ],
      "29-31": [
        { name: "Gói 1 Tháng", value: 10 },
        { name: "Gói 3 Tháng", value: 20 },
        { name: "Gói 6 Tháng", value: 15 },
        { name: "Gói 12 Tháng", value: 8 },
      ],
    },
  },
}

export function RevenueDashboardComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedMonth, setSelectedMonth] = useState("all")

  // Get available months for selected year
  const availableMonths = useMemo(() => {
    const months = [
      { value: "all", label: "Tất cả" },
      { value: "1", label: "Tháng 1" },
      { value: "2", label: "Tháng 2" },
      { value: "3", label: "Tháng 3" },
      { value: "4", label: "Tháng 4" },
      { value: "5", label: "Tháng 5" },
      { value: "6", label: "Tháng 6" },
      { value: "7", label: "Tháng 7" },
      { value: "8", label: "Tháng 8" },
      { value: "9", label: "Tháng 9" },
      { value: "10", label: "Tháng 10" },
      { value: "11", label: "Tháng 11" },
      { value: "12", label: "Tháng 12" },
    ]
    return months
  }, [selectedYear])

  // Get current revenue data based on filters
  const currentRevenueData = useMemo(() => {
    if (selectedYear === "all") {
      return revenueData.all
    }

    const yearData = revenueData[selectedYear]
    if (!yearData) return []

    if (selectedMonth === "all") {
      return yearData.all
    }

    const monthData = yearData[selectedMonth]
    if (!monthData) return []

    return monthData.all
  }, [selectedYear, selectedMonth])

  // Get current package sales data based on filters
  const currentPackageData = useMemo(() => {
    let data = []

    if (selectedYear === "all") {
      data = packageSalesData.all
    } else {
      const yearData = packageSalesData[selectedYear]
      if (!yearData) return []

      if (selectedMonth === "all") {
        data = yearData.all
      } else {
        const monthData = yearData[selectedMonth]
        if (!monthData) return []
        data = monthData.all
      }
    }

    // Assign random colors to the data
    return assignRandomColors(data)
  }, [selectedYear, selectedMonth])

  // Calculate percentages for pie chart
  const pieChartData = useMemo(() => {
    const total = currentPackageData.reduce((sum, item) => sum + item.value, 0)
    return currentPackageData.map((item) => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : "0",
    }))
  }, [currentPackageData])

  // Mock stats data
  const statsData = {
    totalUsers: 2847,
    packageBuyers: 1523,
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getFilterDescription = () => {
    if (selectedYear === "all") {
      return "Tất cả các năm"
    }

    let description = `Năm ${selectedYear}`
    if (selectedMonth !== "all") {
      const monthLabel = availableMonths.find((m) => m.value === selectedMonth)?.label
      description += ` - ${monthLabel}`
    }
    return description
  }

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-6 h-6 text-blue-300 animate-pulse">⭐</div>
        <div className="absolute top-32 right-24 w-5 h-5 text-cyan-300 animate-bounce">⭐</div>
        <div className="absolute bottom-40 left-16 w-5 h-5 text-blue-300 animate-pulse">⭐</div>
        <div className="absolute bottom-32 right-20 w-6 h-6 text-cyan-300 animate-bounce">⭐</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-28 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8 relative">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">Quản Lý Doanh Thu</h1>
          </div>

          {/* Filters */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-200">
              <div className="flex flex-wrap items-center gap-4">
                <Calendar className="w-5 h-5 text-blue-600" />

                {/* Year Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-700">Năm:</span>
                  <Select
                    value={selectedYear}
                    onValueChange={(value) => {
                      setSelectedYear(value)
                      setSelectedMonth("all")
                    }}
                  >
                    <SelectTrigger className="w-28 border-blue-200 focus:border-blue-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Month Filter - Only show when year is not "all" */}
                {selectedYear !== "all" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-700">Tháng:</span>
                    <Select
                      value={selectedMonth}
                      onValueChange={(value) => {
                        setSelectedMonth(value)
                      }}
                    >
                      <SelectTrigger className="w-32 border-blue-200 focus:border-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMonths.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Row - Stats and Pie Chart */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="lg:col-span-1 grid grid-cols-1 gap-4">
              <Card className="bg-white border-2 border-blue-200 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Tổng Người Đăng Ký</p>
                      <p className="text-3xl font-bold text-blue-700">{statsData.totalUsers.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">người dùng</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-2xl">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-green-200 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Người Mua Gói Học</p>
                      <p className="text-3xl font-bold text-green-700">{statsData.packageBuyers.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">khách hàng</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-2xl">
                      <ShoppingCart className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pie Chart */}
            <div className="lg:col-span-2">
              <Card className="bg-white border-2 border-blue-200 shadow-lg rounded-2xl overflow-hidden h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-blue-700 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Phân Bố Gói Học
                  </CardTitle>
                  <CardDescription className="text-gray-600">{getFilterDescription()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {pieChartData.length > 0 ? (
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                      <div className="flex-1 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: any, name: any) => [
                                `${value} gói (${pieChartData.find((item) => item.name === name)?.percentage}%)`,
                                name,
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Legend */}
                      <div className="flex flex-col gap-3">
                        {pieChartData.map((entry, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700">{entry.name}</p>
                              <p className="text-xs text-gray-500">{entry.value} gói</p>
                            </div>
                            <div className="bg-blue-50 px-2 py-1 rounded-lg">
                              <span className="text-sm font-bold text-blue-700">{entry.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Không có dữ liệu</p>
                        <p className="text-sm">Vui lòng chọn bộ lọc khác</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Revenue Chart */}
          <Card className="bg-white border-2 border-blue-200 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-blue-700 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Doanh Thu - {getFilterDescription()}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Biểu đồ doanh thu từ việc bán các gói học ngôn ngữ ký hiệu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis
                      dataKey="period"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(value), "Doanh thu"]}
                      labelStyle={{ color: "#374151" }}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "2px solid #DBEAFE",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default RevenueDashboardComponent
