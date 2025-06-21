"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LearningPath } from "@/components/learning-path"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      {/* Fixed Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} showMenuButton={true} />

      <div className="flex">
        {/* Footer component handles both sidebar (desktop) and footer (mobile) */}
        <Footer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content - shifts right when sidebar is open */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
          <LearningPath sidebarOpen={sidebarOpen} />
        </main>
      </div>
    </div>
  )
}
