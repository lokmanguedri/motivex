"use client"

interface MotivexLogoProps {
  variant?: "full" | "icon"
  size?: "sm" | "md" | "lg"
  className?: string
  inverted?: boolean
}

export function MotivexLogo({ variant = "full", size = "md", className = "", inverted = false }: MotivexLogoProps) {
  const sizes = {
    sm: { icon: 28, text: 14, gap: 6 },
    md: { icon: 36, text: 18, gap: 8 },
    lg: { icon: 48, text: 24, gap: 10 },
  }

  const s = sizes[size]
  const fillColor = inverted ? "#ffffff" : "#2d3436"
  const secondaryColor = inverted ? "rgba(255,255,255,0.7)" : "#636e72"

  const IconSvg = () => (
    <svg 
      width={s.icon} 
      height={s.icon} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* M shape with arrow */}
      <path
        d="M15 75V30L35 55L50 25L65 55L85 30V45"
        stroke={fillColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow head */}
      <path
        d="M75 35L85 45L95 35"
        stroke={secondaryColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow extension */}
      <path
        d="M85 45L85 65"
        stroke={secondaryColor}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )

  if (variant === "icon") {
    return (
      <div className={className}>
        <IconSvg />
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`} style={{ gap: s.gap }}>
      <IconSvg />
      <span 
        style={{ 
          fontSize: s.text, 
          fontWeight: 700, 
          letterSpacing: "0.05em",
          color: fillColor,
        }}
      >
        MOTIVEX
      </span>
    </div>
  )
}
