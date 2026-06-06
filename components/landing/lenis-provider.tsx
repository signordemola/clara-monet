"use client"

import "lenis/dist/lenis.css"
import { ReactLenis } from "lenis/react"

export function LenisProvider({ children }: { children?: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
