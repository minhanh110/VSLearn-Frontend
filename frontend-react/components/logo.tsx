import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ size = "md", showText = false }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  }

  const currentSize = sizes[size]

  return (
    <div className="flex items-center justify-center">
      {/* VSLearn Logo */}
      <div className="relative" style={{ width: currentSize.width, height: currentSize.height }}>
        <Image
          src="/images/vslearn-logo.png"
          alt="VSLearn Logo"
          width={currentSize.width}
          height={currentSize.height}
          className="object-contain"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
          }}
        />
      </div>
    </div>
  )
}
