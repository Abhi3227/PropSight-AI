import { useNavigate } from 'react-router-dom'
import {
  Camera,
  Lightbulb,
  Wrench,
  PhoneCall,
  ShieldCheck,
  Users,
  Building2,
  Star,
  ArrowRight,
  AlertTriangle,
  Flame,
  Zap,
} from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import SectionHeading from '../components/SectionHeading'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#142039] to-[#1D2A49] text-white py-20 sm:py-28">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-7">
            <Zap size={12} className="fill-white" />
            About PropSight AI
          </div>
          <h1 className="text-4xl sm:text-[56px] font-extrabold leading-tight mb-6">
            Property Maintenance,{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #4F8DFF 0%, #3478F6 100%)' }}
            >
              Made Understandable
            </span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            PropSight AI helps homeowners, tenants, landlords and property managers in the UK
            understand property problems before calling a professional — saving time, money, and stress.
          </p>
          <Button size="lg" onClick={() => navigate('/analyze')}>
            Try It Now <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Prototype notice */}
      <section className="py-6 bg-[#F5A623]/10 border-b border-[#F5A623]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-3 items-start">
          <AlertTriangle size={18} className="text-[#F5A623] shrink-0 mt-0.5" />
          <p className="text-sm text-[#142039]">
            <strong>Hackathon Prototype:</strong> PropSight AI is a demonstration prototype. All AI
            assessments are simulated, no real inference is performed, and no data is stored or
            transmitted. This product does not currently offer a real contractor booking service.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            pill="Who It Helps"
            heading="Built for Every Property Stakeholder"
            highlight="Every Property Stakeholder"
            subtext="Whether you own, rent, let, or manage property in the UK — PropSight AI is designed for you."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                role: 'Homeowners',
                desc: 'Diagnose issues early before they escalate. Understand what a contractor will tell you before they arrive.',
              },
              {
                icon: Building2,
                role: 'Tenants',
                desc: 'Know what to report to your landlord and when. Understand whether an issue is urgent or routine.',
              },
              {
                icon: Star,
                role: 'Landlords',
                desc: 'Triage maintenance requests from tenants quickly. Prioritise work orders before calling contractors.',
              },
              {
                icon: Wrench,
                role: 'Property Managers',
                desc: 'Handle a high volume of maintenance queries with structured preliminary assessments and guided next steps.',
              },
            ].map((item) => (
              <Card key={item.role} hover>
                <div className="w-12 h-12 bg-[#F4F7FF] border border-[#E5EBF7] rounded-xl flex items-center justify-center mb-5">
                  <item.icon size={22} className="text-[#3478F6]" />
                </div>
                <h3 className="text-[22px] font-bold text-[#142039] mb-3">{item.role}</h3>
                <p className="text-[#5D79C7] text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-[#F4F7FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            pill="The Process"
            heading="How It Works"
            highlight="How It Works"
          />
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[
                {
                  number: '01',
                  icon: Camera,
                  title: 'Show Us the Problem',
                  desc: 'Upload a photo of the issue — a damp patch, a crack, a leaking pipe — and describe what you have noticed. The more detail you provide, the more targeted the guidance.',
                },
                {
                  number: '02',
                  icon: Lightbulb,
                  title: 'Understand the Signs',
                  desc: 'Our simulated AI assessment analyses visible symptoms and suggests possible explanations. It presents a risk level and highlights whether professional help is likely to be needed.',
                },
                {
                  number: '03',
                  icon: Wrench,
                  title: 'Try Safe Next Steps',
                  desc: 'Where appropriate, PropSight AI provides step-by-step troubleshooting instructions. Safety warnings are clearly displayed for high-risk issues.',
                },
                {
                  number: '04',
                  icon: PhoneCall,
                  title: 'Connect with a Professional',
                  desc: 'If the issue is beyond safe DIY or persists after troubleshooting, our professional help form helps you prepare a clear service request.',
                },
              ].map((step, idx, arr) => (
                <div key={step.number} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#3478F6] rounded-xl flex items-center justify-center shrink-0">
                      <step.icon size={18} className="text-white" />
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="w-0.5 bg-[#E5EBF7] flex-1 mt-2" />
                    )}
                  </div>
                  <Card className="flex-1 mb-2" hover>
                    <span className="text-xs font-bold text-[#3478F6] uppercase tracking-widest mb-1 block">
                      Step {step.number}
                    </span>
                    <h3 className="text-lg font-bold text-[#142039] mb-2">{step.title}</h3>
                    <p className="text-[#5D79C7] text-sm leading-relaxed">{step.desc}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#142039] to-[#1D2A49] rounded-3xl p-10 sm:p-14 text-white relative overflow-hidden">
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
                Safety Guidelines
              </div>
              <h2 className="text-3xl sm:text-[40px] font-bold mb-4 leading-tight">
                Your Safety Comes{' '}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #4F8DFF 0%, #3478F6 100%)' }}
                >
                  First
                </span>
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-8 max-w-2xl">
                PropSight AI is a preliminary guidance tool — not a replacement for professional inspection.
                Please read and follow these safety principles at all times.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    icon: AlertTriangle,
                    title: 'Limitations of Photo Assessment',
                    text: 'A photograph cannot confirm the underlying cause of a property defect. Assessments are based on visible symptoms only.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'In-Person Inspection',
                    text: 'Many issues require an in-person inspection by a qualified professional surveyor, engineer, or tradesperson.',
                  },
                  {
                    icon: Flame,
                    title: 'Never DIY Dangerous Issues',
                    text: 'Gas, electrical, and structural issues must never be treated as DIY projects. Always engage qualified professionals.',
                  },
                  {
                    icon: Zap,
                    title: 'Stop if Unsafe',
                    text: 'Stop following troubleshooting guidance immediately if the situation appears unsafe. Evacuate if necessary and call 999.',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="w-9 h-9 bg-[#F5A623]/20 rounded-lg flex items-center justify-center mb-3">
                      <item.icon size={16} className="text-[#F5A623]" />
                    </div>
                    <h4 className="font-bold text-white text-sm mb-2">{item.title}</h4>
                    <p className="text-white/65 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate('/analyze')}
                >
                  Check My Property Issue
                </Button>
                <Button
                  size="lg"
                  onClick={() => navigate('/professional-help')}
                >
                  Get Professional Help
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack transparency */}
      <section className="py-16 bg-[#F4F7FF]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            pill="Transparency"
            heading="What's Under the Hood"
            highlight="Under the Hood"
            subtext="PropSight AI is a hackathon prototype built with React, TypeScript, and Tailwind CSS."
          />
          <div className="flex flex-wrap justify-center gap-3">
            {['React 18', 'TypeScript', 'Tailwind CSS v4', 'Vite', 'React Router v7', 'Lucide Icons'].map((tech) => (
              <span
                key={tech}
                className="bg-white border border-[#E5EBF7] text-[#1D2A49] text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-[#5D79C7] text-sm mt-6 leading-relaxed">
            All AI responses are simulated client-side. No real machine-learning model is invoked.
            No personal data is stored or transmitted. This project was built as a proof-of-concept.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-[40px] font-bold text-[#142039] mb-4">
            Ready to Try PropSight AI?
          </h2>
          <p className="text-[#5D79C7] text-lg mb-8 leading-relaxed">
            Start with what you can see. Upload a photo and describe the issue.
          </p>
          <Button size="lg" onClick={() => navigate('/analyze')}>
            Analyze My Issue <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
