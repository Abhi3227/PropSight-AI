import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

const CURRENT_YEAR = new Date().getFullYear()

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Analyze Issue', to: '/analyze' },
  { label: 'Safety', to: '/#safety' },
  { label: 'About', to: '/about' },
]

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleFooterClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to.includes('#')) {
      const [path, hash] = to.split('#')
      const targetPath = path || '/'
      if (location.pathname === targetPath) {
        e.preventDefault()
        navigate(to)
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else if (to === location.pathname && !location.hash) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-[#142039] text-white print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo size={28} />
              <span className="font-bold text-white text-lg">
                PropSight <span className="text-[#4F8DFF]">AI</span>
              </span>
            </div>
            <p className="text-sm text-[#8BA3D4] leading-relaxed max-w-xs">
              AI-powered property maintenance assistant for homeowners, tenants,
              landlords and property managers in the UK.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#4F8DFF] mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={(e) => handleFooterClick(e, link.to)}
                    className="text-sm text-[#8BA3D4] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8DFF] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#4F8DFF] mb-4">
              Product Disclaimer
            </h3>
            <p className="text-sm text-[#8BA3D4] leading-relaxed">
              Prototype demonstration: this assessment uses simulated logic and is not a professional inspection.
              PropSight AI does not replace on-site surveys by qualified tradespeople or chartered surveyors.
            </p>
          </div>
        </div>

        <div className="border-t border-[#1D2A49] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-[#8BA3D4]">
            © {CURRENT_YEAR} PropSight AI. Hackathon Prototype Demonstration.
          </p>
          <p className="text-xs text-[#8BA3D4]">
            For evaluation and demonstration purposes only. Not for certified professional use.
          </p>
        </div>
      </div>
    </footer>
  )
}
