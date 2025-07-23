"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface StatusTooltipProps {
  status: string
  label: string
  description?: string
  className?: string
}

export function StatusTooltip({ status, label, description, className = "" }: StatusTooltipProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300"
      case "pending":
        return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300"
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300"
      case "approve":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300"
      case "draft":
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 text-xs font-bold shadow-sm ${getStatusColor(status)} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span>{label}</span>
            {description && (
              <Info className="w-3 h-3 opacity-60" />
            )}
          </div>
        </TooltipTrigger>
        {description && (
          <TooltipContent side="top" className="max-w-xs">
            <div className="p-2">
              <p className="font-medium text-sm">{label}</p>
              <p className="text-xs text-gray-600 mt-1">{description}</p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
} 