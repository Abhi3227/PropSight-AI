import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'

const navLinks = [
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Analyze Issue', to: '/analyze' },
  { label: 'Safety', to: '/#safety' },
  { label: 'About', to: '/about' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const scrollToId = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to.includes('#')) {
      const [path, hash] = to.split('#')
      const targetPath = path || '/'

      if (location.pathname === targetPath) {
        e.preventDefault()
        navigate(to)
        scrollToId(hash)
        return
      }
    } else if (to === location.pathname && !location.hash) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
  }

  const isLinkActive = (to: string) => {
    if (to.includes('#')) {
      const [path, hash] = to.split('#')
      const targetPath = path || '/'
      return location.pathname === targetPath && location.hash === `#${hash}`
    }
    return location.pathname === to && !location.hash
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5EBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => {
              if (location.pathname === '/' && !location.hash) {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="flex items-center gap-2 group"
          >
            <Logo />
            <span className="font-bold text-[#142039] text-lg tracking-tight group-hover:text-[#3478F6] transition-colors">
              PropSight <span className="text-[#3478F6]">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isLinkActive(link.to)
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link.to)}
                  className={`text-sm font-medium transition-colors hover:text-[#3478F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6] rounded ${
                    active ? 'text-[#3478F6]' : 'text-[#5D79C7]'
                  }`}
                >
                  {link.label}
                </NavLink>
              )
            })}
          </nav>

          {/* CTA button */}
          <div className="hidden md:flex items-center">
            <Button size="md" onClick={() => navigate('/analyze')}>
              Analyze My Property
            </Button>
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
            {navLinks.map((link) => {
              const active = isLinkActive(link.to)
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={(e) => {
                    handleNavClick(e, link.to)
                    setOpen(false)
                  }}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#F4F7FF] text-[#3478F6]'
                      : 'text-[#5D79C7] hover:bg-[#F4F7FF] hover:text-[#3478F6]'
                  }`}
                >
                  {link.label}
                </NavLink>
              )
            })}
            <Button
              size="md"
              onClick={() => { navigate('/analyze'); setOpen(false) }}
              className="mt-3 w-full"
            >
              Analyze My Property
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
