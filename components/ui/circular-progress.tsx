"use client"

import type * as React from "react"

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  maxValue: number
  size?: number
  strokeWidth?: number
  label?: string
  valueLabel?: string
  color?: string
}

export function CircularProgress({
  value,
  maxValue,
  size = 100,
  strokeWidth = 8,
  label,
  valueLabel,
  color = "#000",
  className,
  ...props
}: CircularProgressProps) {
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / maxValue) * circumference

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} {...props} className={className}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E2E8F0" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.3s ease 0s" }}
        />
        {valueLabel && (
          <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize={size / 8} fontWeight="bold" fill={color}>
            {valueLabel}
          </text>
        )}
      </svg>
      {label && <span className="absolute bottom-0 text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}
