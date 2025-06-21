import type React from "react"

interface BackgroundCardProps {
  children: React.ReactNode
}

export function BackgroundCard({ children }: BackgroundCardProps) {
  return (
    <div className="w-full max-w-5xl bg-gradient-to-r from-white/95 via-blue-50/90 to-cyan-200/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 lg:p-12 relative overflow-hidden">
      {/* Decorative bubbles - chỉ ở bên phải */}
      <div className="absolute top-6 right-20 w-3 h-3 bg-cyan-400 rounded-full opacity-70 hidden sm:block"></div>
      <div className="absolute top-12 right-32 w-2 h-2 bg-blue-400 rounded-full opacity-60 hidden sm:block"></div>
      <div className="absolute top-20 right-16 w-4 h-4 bg-cyan-300 rounded-full opacity-70 hidden sm:block"></div>
      <div className="absolute bottom-20 right-24 w-3 h-3 bg-blue-300 rounded-full opacity-70 hidden sm:block"></div>
      <div className="absolute bottom-32 right-40 w-2 h-2 bg-cyan-400 rounded-full opacity-60 hidden sm:block"></div>

      {/* Star decorations - chỉ bên phải */}
      <div className="absolute top-16 right-12 text-yellow-300 opacity-80 hidden sm:block">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute bottom-16 right-8 text-yellow-200 opacity-70 hidden sm:block">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute top-32 right-6 text-yellow-300 opacity-60 hidden sm:block">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute bottom-32 right-16 text-yellow-200 opacity-50 hidden sm:block">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute top-24 right-20 text-orange-300 opacity-70 hidden sm:block">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute bottom-24 right-28 text-amber-300 opacity-60 hidden sm:block">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute top-8 right-36 text-yellow-400 opacity-60 hidden sm:block">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute top-40 right-10 text-orange-200 opacity-80 hidden sm:block">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute bottom-8 right-32 text-yellow-300 opacity-70 hidden sm:block">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute top-20 right-44 text-amber-200 opacity-50 hidden sm:block">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute bottom-40 right-12 text-yellow-200 opacity-60 hidden sm:block">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute top-48 right-24 text-orange-300 opacity-70 hidden sm:block">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute bottom-12 right-40 text-yellow-400 opacity-80 hidden sm:block">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="absolute top-36 right-52 text-amber-300 opacity-50 hidden sm:block">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
