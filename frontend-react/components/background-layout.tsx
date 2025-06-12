import type React from "react"
import Image from "next/image"

interface BackgroundLayoutProps {
  children: React.ReactNode
}

export function BackgroundLayout({ children }: BackgroundLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <Image src="/images/whale-background-new.png" alt="Whale background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">{children}</div>
    </div>
  )
}
