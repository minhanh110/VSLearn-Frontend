import Image from "next/image"

interface WhaleCharacterProps {
  expression?: "happy" | "winking" | "sleepy" | "excited"
  message?: string
  size?: "sm" | "md" | "lg"
}

export function WhaleCharacter({ expression = "happy", message, size = "md" }: WhaleCharacterProps) {
  const sizes = {
    sm: { width: 160, height: 160 },
    md: { width: 220, height: 220 },
    lg: { width: 280, height: 280 },
  }

  const currentSize = sizes[size]

  // Message bubble sizes based on whale size
  const messageSizes = {
    sm: "max-w-[140px] text-xs p-2",
    md: "max-w-[180px] text-sm p-3",
    lg: "max-w-[220px] text-sm p-4",
  }

  return (
    <div className="relative text-center">
      {/* Speech bubble */}
      {message && (
        <div
          className={`bg-white/90 backdrop-blur-sm rounded-xl mb-4 relative shadow-lg mx-auto ${messageSizes[size]}`}
        >
          <div className="flex items-center gap-2" style={{ color: "#93D6F6" }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span className="font-medium leading-tight">{message}</span>
          </div>
          <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white/90 transform rotate-45"></div>
        </div>
      )}

      {/* Whale character image */}
      <div className="relative flex justify-center">
        <div className="relative">
          <Image
            src="/images/whale-character.png"
            alt="Cute whale character"
            width={currentSize.width}
            height={currentSize.height}
            className="drop-shadow-lg object-contain"
            style={{
              filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))",
              background: "transparent",
            }}
            priority
          />
        </div>
      </div>
    </div>
  )
}
