"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PowerOff } from "lucide-react"

interface DeactivateButtonProps {
  onClick: () => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
}

export function DeactivateButton({ onClick, disabled = false, size = "sm" }: DeactivateButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            disabled={disabled}
            size={size}
            className="group/btn relative p-2 sm:p-3 bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-600 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 overflow-hidden disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <PowerOff className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-sm">Vô hiệu hóa chủ đề</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 