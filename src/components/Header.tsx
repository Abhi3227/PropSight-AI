import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

const navLinks = [
  { label: 'How It Works', to: '/about#how-it-works' },
  { label: 'Analyze Issue', to: '/analyze' },
  { label: 'Safety', to: '/about#safety' },
  { label: 'About', to: '/about' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5EBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Logo />
            <span className="font-bold text-[#142039] text-lg tracking-tight group-hover:text-[#3478F6] transition-colors">
              PropSight <span className="text-[#3478F6]">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-[#3478F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6] rounded ${
                    isActive ? 'text-[#3478F6]' : 'text-[#5D79C7]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => navigate('/analyze')}
              className="bg-[#3478F6] hover:bg-[#4F8DFF] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6] focus-visible:ring-offset-2 active:scale-95"
            >
              Analyze My Property
            </button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-[#5D79C7] hover:text-[#3478F6] hover:bg-[#F4F7FF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6]"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#E5EBF7] bg-white">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F4F7FF] text-[#3478F6]'
                      : 'text-[#5D79C7] hover:bg-[#F4F7FF] hover:text-[#3478F6]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={() => { navigate('/analyze'); setOpen(false) }}
              className="mt-3 bg-[#3478F6] hover:bg-[#4F8DFF] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6]"
            >
              Analyze My Property
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
