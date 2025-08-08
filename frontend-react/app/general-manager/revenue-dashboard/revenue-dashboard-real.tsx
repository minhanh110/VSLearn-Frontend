"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { Users, ShoppingCart, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

// Function to generate random colors
const generateRandomColor = () => {
  const colors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
    "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6366F1",
    "#14B8A6", "#F59E0B", "#DC2626", "#7C3AED", "#059669"
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function RevenueDashboardComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Separate filters for each chart
  const [pieChartYear, setPieChartYear] = useState("all")
  const [pieChartMonth, setPieChartMonth] = useState("all")
  const [barChartYear, setBarChartYear] = useState("all")
  const [barChartMonth, setBarChartMonth] = useState("all")
  
  // Real data state
  const [revenueData, setRevenueData] = useState([])
  const [packageData, setPackageData] = useState([])
  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    uniqueCustomers: 0,
    totalUsers: 0,
    packageBuyers: 0
  })

  // Get available months for selected year
  const availableMonths = [
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

  // Fetch revenue stats
  const fetchRevenueStats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      
      const response = await axios.get(`${API_BASE_URL}/api/v1/revenue/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data && response.data.status === 200) {
        setStatsData({
          totalRevenue: response.data.totalRevenue || 0,
          totalTransactions: response.data.totalTransactions || 0,
          uniqueCustomers: response.data.uniqueCustomers || 0,
          totalUsers: response.data.totalUsers || 0,
          packageBuyers: response.data.packageBuyers || 0
        })
      }
    } catch (err: any) {
      console.error("Error fetching revenue stats:", err)
      setError("Không thể tải thống kê doanh thu")
    } finally {
      setLoading(false)
    }
  }

  // Fetch revenue by period
  const fetchRevenueByPeriod = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      
      const params = new URLSearchParams()
      if (barChartYear !== "all") params.append("year", barChartYear)
      if (barChartMonth !== "all") params.append("month", barChartMonth)
      
      const response = await axios.get(`${API_BASE_URL}/api/v1/revenue/by-period?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data && response.data.status === 200) {
        setRevenueData(response.data.revenueData || [])
      }
    } catch (err: any) {
      console.error("Error fetching revenue by period:", err)
      setError("Không thể tải dữ liệu doanh thu")
    } finally {
      setLoading(false)
    }
  }

  // Fetch package stats
  const fetchPackageStats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      
      const params = new URLSearchParams()
      if (pieChartYear !== "all") params.append("year", pieChartYear)
      if (pieChartMonth !== "all") params.append("month", pieChartMonth)
      
      const response = await axios.get(`${API_BASE_URL}/api/v1/revenue/package-stats?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data && response.data.status === 200) {
        const packageStats = response.data.packageStats || []
        // Add colors to package data
        const packageDataWithColors = packageStats.map((pkg: any) => ({
          ...pkg,
          color: generateRandomColor()
        }))
        setPackageData(packageDataWithColors)
      }
    } catch (err: any) {
      console.error("Error fetching package stats:", err)
      setError("Không thể tải thống kê gói học")
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchRevenueStats()
  }, [])

  // Load data when filters change
  useEffect(() => {
    fetchRevenueByPeriod()
  }, [barChartYear, barChartMonth])

  useEffect(() => {
    fetchPackageStats()
  }, [pieChartYear, pieChartMonth])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getPieChartFilterDescription = () => {
    if (pieChartYear === "all") {
      return "Tất cả các năm"
    }

    let description = `Năm ${pieChartYear}`
    if (pieChartMonth !== "all") {
      const monthLabel = availableMonths.find((m) => m.value === pieChartMonth)?.label
      description += ` - ${monthLabel}`
    }
    return description
  }

  const getBarChartFilterDescription = () => {
    if (barChartYear === "all") {
      return "Tất cả các năm"
    }

    let description = `Năm ${barChartYear}`
    if (barChartMonth !== "all") {
      const monthLabel = availableMonths.find((m) => m.value === barChartMonth)?.label
      description += ` - ${monthLabel}`
    }
    return description
  }

  // Calculate percentages for pie chart
  const pieChartData = packageData.map((item: any) => {
    const total = packageData.reduce((sum: number, pkg: any) => sum + pkg.value, 0)
    return {
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : "0",
    }
  })

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 40;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.02) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="#374151" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

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
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                {error}
              </div>
            )}
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
                  <CardDescription className="text-gray-600">
                    Tỷ lệ phần trăm các gói học được mua - {getPieChartFilterDescription()}
                  </CardDescription>
                  
                  {/* Pie Chart Filters */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    
                    {/* Year Filter for Pie Chart */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-700">Năm:</span>
                      <Select
                        value={pieChartYear}
                        onValueChange={(value) => {
                          setPieChartYear(value)
                          setPieChartMonth("all")
                        }}
                      >
                        <SelectTrigger className="w-24 h-8 text-sm border-blue-200 focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Month Filter for Pie Chart */}
                    {pieChartYear !== "all" && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-700">Tháng:</span>
                        <Select
                          value={pieChartMonth}
                          onValueChange={(value) => {
                            setPieChartMonth(value)
                          }}
                        >
                          <SelectTrigger className="w-28 h-8 text-sm border-blue-200 focus:border-blue-400">
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
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-80">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                    </div>
                  ) : pieChartData.length > 0 ? (
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                      <div className="flex-1 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={renderCustomizedLabel}
                              innerRadius={70}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieChartData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: any, name: any) => [
                                `${value} gói (${pieChartData.find((item: any) => item.name === name)?.percentage}%)`,
                                name,
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Legend */}
                      <div className="flex flex-col gap-3">
                        {pieChartData.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">{entry.name}</p>
                              <p className="text-xs text-gray-500">{formatCurrency(entry.packageRevenue || 0)}</p>
                            </div>
                            <div className="bg-blue-50 px-2 py-1 rounded-lg text-center">
                              <span className="text-xs text-gray-600">{entry.value} gói</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-80 text-gray-500">
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
                Doanh Thu - {getBarChartFilterDescription()}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Biểu đồ doanh thu từ việc bán các gói học ngôn ngữ ký hiệu - Tổng: {formatCurrency(statsData.totalRevenue)}
              </CardDescription>
              
              {/* Bar Chart Filters */}
              <div className="flex flex-wrap items-center gap-4 mt-4 p-3 bg-green-50 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
                
                {/* Year Filter for Bar Chart */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-700">Năm:</span>
                  <Select
                    value={barChartYear}
                    onValueChange={(value) => {
                      setBarChartYear(value)
                      setBarChartMonth("all")
                    }}
                  >
                    <SelectTrigger className="w-24 h-8 text-sm border-green-200 focus:border-green-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Month Filter for Bar Chart */}
                {barChartYear !== "all" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-700">Tháng:</span>
                    <Select
                      value={barChartMonth}
                      onValueChange={(value) => {
                        setBarChartMonth(value)
                      }}
                    >
                      <SelectTrigger className="w-28 h-8 text-sm border-green-200 focus:border-green-400">
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
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
                </div>
              ) : revenueData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-500">
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

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default RevenueDashboardComponent 