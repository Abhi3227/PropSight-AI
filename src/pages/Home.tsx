import { useNavigate } from 'react-router-dom'
import {
  Camera,
  Lightbulb,
  Wrench,
  PhoneCall,
  ShieldCheck,
  History,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Droplets,
  Flame,
  Sparkles,
  Layers,
  CloudRain,
} from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import SectionHeading from '../components/SectionHeading'
import { SAMPLE_ISSUES, type SampleIssue } from '../utils/sampleIssues'

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero({ onSelectSample }: { onSelectSample: (s: SampleIssue) => void }) {
  const navigate = useNavigate()
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Grid + radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(52,120,246,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#3478F6 1px, transparent 1px), linear-gradient(90deg, #3478F6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 bg-[#F4F7FF] border border-[#E5EBF7] text-[#3478F6] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-7 shadow-xs">
            <Zap size={12} className="fill-[#3478F6]" />
            AI-Assisted Property Triage
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold text-[#142039] leading-[1.08] tracking-tight mb-6">
            Understand Your{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #3478F6 0%, #4F8DFF 100%)',
              }}
            >
              Property Problem.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-[#5D79C7] text-base sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Spot the signs, understand the likely cause, and discover safe next steps.
            Get guided troubleshooting first, with professional help when you need it.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Button size="lg" onClick={() => navigate('/analyze')} className="flex items-center justify-center gap-2">
              Analyze My Issue <ArrowRight size={18} />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                document.getElementById('demo-samples')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="text-[#3478F6]" /> Try a Sample Issue
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate('/about')}>
              How It Works
            </Button>
          </div>

          {/* Quick sample chips for judges */}
          <div className="p-4 rounded-2xl bg-[#F4F7FF] border border-[#E5EBF7] inline-block max-w-xl mx-auto text-left mb-10">
            <div className="flex items-center gap-2 text-xs font-bold text-[#142039] mb-2">
              <Sparkles size={14} className="text-[#3478F6]" />
              <span>Hackathon Demo Presets:</span>
              <span className="text-[#5D79C7] font-normal">Select an issue to test the full journey</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_ISSUES.slice(0, 3).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectSample(s)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E5EBF7] text-xs font-medium text-[#142039] hover:border-[#3478F6] hover:text-[#3478F6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                >
                  {s.title} &rarr;
                </button>
              ))}
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {[
              { icon: Camera, label: 'Photo-assisted triage' },
              { icon: Lightbulb, label: 'Step-by-step guidance' },
              { icon: PhoneCall, label: 'Professional escalation' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[#5D79C7] text-xs sm:text-sm font-medium">
                <div className="w-6 h-6 bg-[#F4F7FF] border border-[#E5EBF7] rounded-lg flex items-center justify-center">
                  <Icon size={13} className="text-[#3478F6]" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Demonstration Samples Section ───────────────────────────────────────────
function DemoSamplesSection({ onSelectSample }: { onSelectSample: (s: SampleIssue) => void }) {
  const getSampleIcon = (id: string) => {
    switch (id) {
      case 'damp-wall':
        return Droplets
      case 'peeling-paint':
        return Layers
      case 'sink-leak':
        return CloudRain
      default:
        return Sparkles
    }
  }

  return (
    <section id="demo-samples" className="py-16 bg-[#F4F7FF] border-y border-[#E5EBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          pill="Demonstration Mode"
          heading="Try a Sample Issue"
          highlight="Sample Issue"
          subtext="Select one of three preconfigured property problems to experience the full triage, assessment, and escalation workflow without uploading your own photo."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SAMPLE_ISSUES.slice(0, 3).map((sample) => {
            const Icon = getSampleIcon(sample.id)
            return (
              <Card
                key={sample.id}
                hover
                className="flex flex-col justify-between p-6 border-2 hover:border-[#3478F6] transition-all bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7] flex items-center justify-center text-[#3478F6]">
                      <Icon size={20} />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sample.badgeColor}`}>
                      {sample.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#142039] mb-1.5">{sample.title}</h3>
                  <p className="text-xs text-[#5D79C7] leading-relaxed mb-4">
                    {sample.descriptionText}
                  </p>

                  <div className="p-3 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7] text-[11px] text-[#142039] space-y-1 mb-5">
                    <p><strong>Location:</strong> {sample.location}</p>
                    <p><strong>Timeline:</strong> {sample.firstNoticed}</p>
                    <p><strong>Test purpose:</strong> {sample.suggestedOutcome}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => onSelectSample(sample)}
                  className="w-full flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} /> Test This Sample &rarr;
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Product Preview ──────────────────────────────────────────────────────────
function ProductPreview() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-block bg-[#3478F6]/10 text-[#3478F6] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-[#3478F6]/20 mb-3">
            Prototype Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#142039]">
            What a PropSight AI Assessment Looks Like
          </h2>
          <p className="text-[#5D79C7] text-sm mt-1">
            Simulated output combining visible symptoms with safe UK trade recommendations
          </p>
        </div>

        <Card className="overflow-hidden p-0 border-[#E5EBF7]">
          <div className="flex flex-col md:flex-row">
            {/* Simulated image illustration */}
            <div className="md:w-2/5 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center min-h-56 relative overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                <div className="w-32 h-24 bg-white/70 rounded-xl border border-white/90 shadow-xs flex items-center justify-center relative overflow-hidden">
                  <Droplets size={36} className="text-[#3478F6] opacity-70" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#3478F6]/15 rounded-b-xl" />
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#F5A623]/40" />
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Example photo representation</span>
              </div>
            </div>

            {/* Assessment panel */}
            <div className="flex-1 p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#5D79C7] mb-0.5">
                    Issue Category
                  </p>
                  <h3 className="text-xl font-bold text-[#142039]">Damp &amp; Moisture</h3>
                </div>
                <span className="shrink-0 flex items-center gap-1.5 bg-[#F5A623]/10 text-[#F5A623] text-xs font-semibold px-3 py-1 rounded-full border border-[#F5A623]/20">
                  <AlertTriangle size={12} />
                  Moderate Priority
                </span>
              </div>

              <div className="bg-[#F4F7FF] rounded-xl p-3.5 space-y-1.5 border border-[#E5EBF7]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
                  Demonstration Assessment Findings
                </p>
                <p className="text-xs sm:text-sm text-[#1D2A49] leading-relaxed">
                  Visible moisture staining and perimeter discolouration on interior wall suggests penetrating damp. Likely correlated with external gutter overflow or defective masonry pointing.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#5D79C7] mb-1">
                  Recommended Immediate Step
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#142039] font-medium">
                  <CheckCircle2 size={16} className="text-[#16C784] shrink-0" />
                  Inspect external downpipes from ground level during rainfall for overflow or detached brackets
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5EBF7]">
                <p className="text-xs text-[#5D79C7] leading-relaxed">
                  Prototype demonstration: this assessment uses simulated logic and is not a professional inspection.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Camera,
      title: 'Show Us the Problem',
      desc: 'Upload a photo and describe what you have noticed. A few details help tailor the guidance.',
    },
    {
      number: '02',
      icon: Lightbulb,
      title: 'Understand the Signs',
      desc: 'Receive preliminary rule-based triage distinguishing visible signs from potential underlying causes.',
    },
    {
      number: '03',
      icon: Wrench,
      title: 'Try Safe Next Steps',
      desc: 'Follow practical step-by-step troubleshooting when it is appropriate and safe to do so.',
    },
    {
      number: '04',
      icon: PhoneCall,
      title: 'Get Professional Help',
      desc: 'If the problem persists or requires an expert, compile a structured service request.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          pill="Simple Process"
          heading="How PropSight AI Works"
          highlight="PropSight AI"
          subtext="Four straightforward steps from spotting the problem to preparing a trade request."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <Card key={step.number} hover className="relative">
              <div className="absolute top-4 right-4 text-4xl font-extrabold text-[#E5EBF7]">
                {step.number}
              </div>
              <div className="w-12 h-12 bg-[#F4F7FF] border border-[#E5EBF7] rounded-xl flex items-center justify-center mb-5">
                <step.icon size={22} className="text-[#3478F6]" />
              </div>
              <h3 className="text-xl font-bold text-[#142039] mb-3 leading-snug">{step.title}</h3>
              <p className="text-[#5D79C7] text-sm leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: Camera,
      title: 'Photo-Based Triage',
      desc: 'Upload images of the issue. Our simulated analysis categorises visible symptoms and highlights diagnostic gaps.',
      badge: 'Prototype Demo',
    },
    {
      icon: Lightbulb,
      title: 'Interactive Troubleshooting',
      desc: 'Receive one step at a time guidance tailored to the type of issue — from damp to roofing to plumbing leaks.',
      badge: 'Functional',
    },
    {
      icon: History,
      title: 'Issue History & Tracking',
      desc: 'Keep a record of submitted issues and outcomes. Designed for landlords and property managers.',
      badge: 'Architecture Ready',
    },
    {
      icon: PhoneCall,
      title: 'Professional Service Escalation',
      desc: 'When an issue is beyond DIY, compile your notes into a structured service request dossier.',
      badge: 'Functional Demo',
    },
    {
      icon: ShieldCheck,
      title: 'Safety-First Circuit Breakers',
      desc: 'Immediate emergency warnings stop DIY attempts for gas, active leaks near electrics, or unstable ceilings.',
      badge: 'Safety Triage',
    },
    {
      icon: Zap,
      title: 'Fast Rule-Based Engine',
      desc: 'Instant rule-based responses give homeowners immediate clarity on triage priority without server lag.',
      badge: 'Modular API Ready',
    },
  ]

  return (
    <section className="py-20 bg-[#F4F7FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          pill="Features"
          heading="Everything You Need to Manage Property Issues"
          highlight="Manage Property Issues"
          subtext="From initial photo observation to professional trade escalation — PropSight AI guides every step."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <Card key={feat.title} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 bg-white border border-[#E5EBF7] rounded-xl flex items-center justify-center shadow-xs">
                  <feat.icon size={20} className="text-[#3478F6]" />
                </div>
                {feat.badge && (
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-white border-[#E5EBF7] text-[#5D79C7]">
                    {feat.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#142039] mb-2">{feat.title}</h3>
              <p className="text-[#5D79C7] text-sm leading-relaxed">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Safety ───────────────────────────────────────────────────────────────────
function Safety() {
  const navigate = useNavigate()
  const warnings = [
    {
      icon: AlertTriangle,
      text: 'A photo alone cannot confirm the underlying cause of a property defect.',
    },
    {
      icon: ShieldCheck,
      text: 'Some issues require an in-person inspection by a qualified professional.',
    },
    {
      icon: Flame,
      text: 'Gas, electrical, and structural issues must never be treated as DIY projects.',
    },
    {
      icon: Zap,
      text: 'Stop troubleshooting immediately if a situation appears unsafe.',
    },
  ]

  return (
    <section id="safety" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#142039] to-[#1D2A49] rounded-3xl p-10 sm:p-14 text-white relative overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(79,141,255,0.12) 0%, transparent 70%)',
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <ShieldCheck size={12} />
              Safety First
            </div>
            <h2 className="text-3xl sm:text-[40px] font-bold mb-6 leading-tight">
              Your Safety{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #4F8DFF 0%, #3478F6 100%)' }}
              >
                Comes First
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {warnings.map((w) => (
                <div key={w.text} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="w-8 h-8 shrink-0 bg-[#F5A623]/20 rounded-lg flex items-center justify-center">
                    <w.icon size={16} className="text-[#F5A623]" />
                  </div>
                  <p className="text-sm text-white/85 leading-relaxed">{w.text}</p>
                </div>
              ))}
            </div>
            <p className="text-white/70 text-sm mb-8 max-w-lg leading-relaxed">
              PropSight AI always recommends professional assistance when an issue appears hazardous
              or is beyond safe DIY scope.
            </p>
            <Button
              size="lg"
              className="bg-white text-[#142039] hover:bg-[#F4F7FF] !shadow-none font-bold"
              onClick={() => navigate('/analyze')}
            >
              Check My Property Issue
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  const navigate = useNavigate()
  return (
    <section className="py-20 bg-[#F4F7FF]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-[40px] font-bold text-[#142039] mb-4 leading-tight">
          Not Sure What's Wrong?
        </h2>
        <p className="text-[#5D79C7] text-base sm:text-lg mb-8 leading-relaxed">
          Start with what you can see. We'll help you understand the next step.
        </p>
        <Button size="lg" onClick={() => navigate('/analyze')}>
          Analyze My Issue <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()

  const handleSelectSample = (sample: SampleIssue) => {
    // Populate form data into sessionStorage draft & submission
    const submissionData = {
      issueCategory: sample.category,
      category: sample.category,
      description: sample.description,
      location: sample.location,
      firstNoticed: sample.firstNoticed,
      gettingWorse: sample.gettingWorse,
      happenedBefore: sample.happenedBefore,
      propertyType: sample.propertyType,
      affectedArea: sample.affectedArea,
      afterRainOrPlumbing: sample.afterRainOrPlumbing,
      wideningCrack: sample.wideningCrack,
      hasImage: false,
      imagePreview: null,
      urgency: sample.gettingWorse === 'Yes' ? 'high' : 'medium',
      timestamp: new Date().toISOString(),
    }
    sessionStorage.setItem('propsight_submission', JSON.stringify(submissionData))
    sessionStorage.setItem('propsight_analyze_draft', JSON.stringify({
      ...submissionData,
      imageName: null,
      locationOther: '',
      waterNearElectrics: sample.waterNearElectrics,
      unstableStructure: sample.unstableStructure,
      rapidLeak: sample.rapidLeak,
      gasSmell: sample.gasSmell,
    }))

    // Navigate to analyze with sample pre-loaded so judges can see and step through
    navigate(`/analyze?sample=${sample.id}`)
  }

  return (
    <>
      <Hero onSelectSample={handleSelectSample} />
      <DemoSamplesSection onSelectSample={handleSelectSample} />
      <ProductPreview />
      <HowItWorks />
      <Features />
      <Safety />
      <CTA />
    </>
  )
}
