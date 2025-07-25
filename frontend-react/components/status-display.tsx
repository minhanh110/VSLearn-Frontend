interface StatusDisplayProps {
  status: string
  className?: string
}

export function StatusDisplay({ status, className = "" }: StatusDisplayProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300"
      case "pending":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300"
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300"
      case "inactive":
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "HOẠT ĐỘNG"
      case "pending":
        return "ĐANG KIỂM DUYỆT"
      case "rejected":
        return "BỊ TỪ CHỐI"
      case "inactive":
        return "KHÔNG HOẠT ĐỘNG"
      default:
        return "CHƯA XÁC ĐỊNH"
    }
  }

  return (
    <span
      className={`px-3 py-2 rounded-xl text-xs font-bold border-2 shadow-sm ${getStatusColor(
        status,
      )} ${className}`}
    >
      {getStatusText(status)}
    </span>
  )
} 