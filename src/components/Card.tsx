import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-[#E5EBF7] p-6 ${
        hover ? 'hover:shadow-md hover:-translate-y-1 transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
