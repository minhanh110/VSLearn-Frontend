import { AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react"

interface ApprovalNoticeProps {
  type: "create" | "edit"
  contentType: "topic" | "vocab"
}

export function ApprovalNotice({ type, contentType }: ApprovalNoticeProps) {
  const getContentTypeText = () => {
    return contentType === "topic" ? "chủ đề" : "từ vựng"
  }

  const getActionText = () => {
    return type === "create" ? "tạo" : "chỉnh sửa"
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-blue-800 mb-2">
            Thông báo về quy trình duyệt
          </h3>
          <div className="space-y-3 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>
                Khi bạn {getActionText()} {getContentTypeText()}, nó sẽ được gửi để duyệt với trạng thái <strong>"Đang kiểm duyệt"</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>
                Sau khi được <strong>Content Approver</strong> duyệt, {getContentTypeText()} sẽ chuyển sang trạng thái <strong>"Hoạt động"</strong> và hiển thị cho người dùng
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span>
                Nếu bị từ chối, {getContentTypeText()} sẽ có trạng thái <strong>"Bị từ chối"</strong> và bạn có thể chỉnh sửa để gửi lại
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 