import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6] focus-visible:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'

  const variants = {
    primary:
      'bg-[#3478F6] hover:bg-[#2563EB] text-white hover:text-white border-0 shadow-sm hover:shadow-md',
    secondary:
      'bg-transparent border-2 border-[#3478F6] text-[#3478F6] hover:bg-[#F4F7FF] hover:border-[#2563EB] hover:text-[#2563EB]',
    ghost:
      'bg-transparent text-[#5D79C7] hover:text-[#3478F6] hover:bg-[#F4F7FF] border-0',
  }

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-7 py-3.5',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
