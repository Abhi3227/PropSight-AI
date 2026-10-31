import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import Results from './pages/Results'
import ProfessionalHelp from './pages/ProfessionalHelp'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/results" element={<Results />} />
            <Route path="/professional-help" element={<ProfessionalHelp />} />
            <Route path="/about" element={<About />} />
            <Route path="/safety" element={<Navigate to="/#safety" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
