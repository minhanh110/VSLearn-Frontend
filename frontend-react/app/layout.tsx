import type React from "react"
import type { Metadata } from "next"
import { Baloo_2 } from "next/font/google"
import "./globals.css"

const baloo2 = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Hệ thống xác thực Whale",
  description: "Hệ thống xác thực hoàn chỉnh với thiết kế chủ đề cá voi đẹp mắt",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={baloo2.className}>{children}</body>
    </html>
  )
}
