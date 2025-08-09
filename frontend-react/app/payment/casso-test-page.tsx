"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check, X } from "lucide-react"
import api from "@/lib/axios"

interface CassoTransaction {
  id: number
  tid: string
  description: string
  amount: number
  cusumBalance: number
  when: string
  bankSubAccId: string
  paymentChannel: string
  virtualAccount: string
  virtualAccountName: string
  corresponsiveName: string
  corresponsiveAccount: string
  corresponsiveBankId: string
  corresponsiveBankName: string
  accountId: number
  bankCodeName: string
}

interface CassoAccount {
  id: number
  name: string
  bankName: string
  accountNumber: string
  accountName: string
  bankCodeName: string
  status: string
  createdAt: string
  updatedAt: string
}

export function CassoTestPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<CassoTransaction[]>([])
  const [accounts, setAccounts] = useState<CassoAccount[]>([])
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [checkResult, setCheckResult] = useState<any>(null)
  const [transactionCode, setTransactionCode] = useState("")
  const [amount, setAmount] = useState("299000")

  const getTransactions = async () => {
    setLoading(true)
    try {
      const response = await api.get("/payment/casso/transactions", {
        params: { days: 7 }
      })
      
      if (response.data.success) {
        setTransactions(response.data.data.transactions)
        console.log("Casso transactions:", response.data.data.transactions)
      }
    } catch (error) {
      console.error("Lỗi lấy giao dịch:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAccounts = async () => {
    setLoading(true)
    try {
      const response = await api.get("/payment/casso/accounts")
      
      if (response.data.success) {
        setAccounts(response.data.data.accounts)
        console.log("Casso accounts:", response.data.data.accounts)
      }
    } catch (error) {
      console.error("Lỗi lấy tài khoản:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkPayment = async () => {
    if (!transactionCode.trim()) {
      alert("Vui lòng nhập transaction code")
      return
    }

    setCheckingPayment(true)
    try {
      const response = await api.get(`/payment/casso/check/${transactionCode}`, {
        params: { amount: parseFloat(amount) }
      })
      
      setCheckResult(response.data)
      console.log("Check result:", response.data)
    } catch (error) {
      console.error("Lỗi kiểm tra thanh toán:", error)
      setCheckResult({ success: false, message: "Có lỗi xảy ra" })
    } finally {
      setCheckingPayment(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      <div className="pt-16 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">Test Casso API</h1>

          {/* Test Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Get Accounts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Lấy Tài Khoản</h2>
              <Button 
                onClick={getAccounts}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Lấy danh sách tài khoản
                  </>
                )}
              </Button>
            </div>

            {/* Get Transactions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Lấy Giao Dịch</h2>
              <Button 
                onClick={getTransactions}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Lấy giao dịch 7 ngày gần nhất
                  </>
                )}
              </Button>
            </div>

            {/* Check Payment */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Kiểm Tra Thanh Toán</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Transaction Code:</label>
                  <input
                    type="text"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    placeholder="Nhập transaction code..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (VND):</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="299000"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <Button 
                  onClick={checkPayment}
                  disabled={checkingPayment || !transactionCode.trim()}
                  className="w-full"
                >
                  {checkingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Kiểm tra thanh toán
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Check Result */}
          {checkResult && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Kết Quả Kiểm Tra</h2>
              <div className={`p-4 rounded-lg ${
                checkResult.success && checkResult.isPaid 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-red-100 border border-red-300'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {checkResult.success && checkResult.isPaid ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {checkResult.success && checkResult.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{checkResult.message}</p>
                {checkResult.data && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Transaction Code: {checkResult.data.transactionCode}</p>
                    <p>Expected Amount: {checkResult.data.expectedAmount?.toLocaleString()} VND</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Accounts List */}
          {accounts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Tài Khoản Ngân Hàng ({accounts.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Tên</th>
                      <th className="text-left p-2">Ngân hàng</th>
                      <th className="text-left p-2">Số tài khoản</th>
                      <th className="text-left p-2">Tên chủ tài khoản</th>
                      <th className="text-left p-2">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono">{account.id}</td>
                        <td className="p-2">{account.name}</td>
                        <td className="p-2">{account.bankName}</td>
                        <td className="p-2 font-mono">{account.accountNumber}</td>
                        <td className="p-2">{account.accountName}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            account.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {account.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transactions List */}
          {transactions.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Giao Dịch ({transactions.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">TID</th>
                      <th className="text-left p-2">Mô tả</th>
                      <th className="text-left p-2">Số tiền</th>
                      <th className="text-left p-2">Thời gian</th>
                      <th className="text-left p-2">Ngân hàng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{transaction.id}</td>
                        <td className="p-2 font-mono text-xs">{transaction.tid}</td>
                        <td className="p-2 max-w-xs truncate">{transaction.description}</td>
                        <td className={`p-2 font-medium ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount.toLocaleString()} VND
                        </td>
                        <td className="p-2 text-xs">
                          {new Date(transaction.when).toLocaleString('vi-VN')}
                        </td>
                        <td className="p-2 text-xs">{transaction.bankCodeName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
} 