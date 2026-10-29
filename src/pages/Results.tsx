import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  RotateCcw,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Camera,
  MapPin,
  Clock,
  HelpCircle,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import {
  evaluateAssessment,
  type UserSubmission,
  type PriorityLevel,
} from '../utils/assessmentEngine'
import { SAMPLE_ISSUES, type SampleIssue } from '../utils/sampleIssues'

function getNowIso(): string {
  return new Date().toISOString()
}

// Fallback sample data when user visits /results directly
const SAMPLE_SUBMISSION: UserSubmission = {
  issueCategory: 'Damp or Moisture',
  description:
    'Discoloured yellowish damp patch appearing on the living room ceiling approximately 35cm across. Noticeably damper following heavy rain over the weekend.',
  location: 'Living room',
  firstNoticed: 'Within the past week',
  gettingWorse: 'Yes',
  happenedBefore: 'No',
  propertyType: 'Terraced house',
  affectedArea: '35 cm circular ceiling patch',
  afterRainOrPlumbing: 'After rain',
  wideningCrack: 'No',
  hasImage: false,
  imagePreview: null,
  timestamp: new Date().toISOString(),
}

type OutcomeType =
  | 'resolved'
  | 'improved_present'
  | 'no_improvement'
  | 'getting_worse'
  | null

export default function Results() {
  const navigate = useNavigate()

  // Initialize submission via lazy initializer to prevent setState in effect
  const [submission, setSubmission] = useState<UserSubmission>(() => {
    const raw = sessionStorage.getItem('propsight_submission')
    if (raw) {
      try {
        return JSON.parse(raw) as UserSubmission
      } catch {
        return SAMPLE_SUBMISSION
      }
    }
    return SAMPLE_SUBMISSION
  })

  const [isUsingFallback] = useState<boolean>(() => {
    return !sessionStorage.getItem('propsight_submission')
  })

  // Fixed timestamp string initialized once to avoid impure function calls during render
  const [generatedDate] = useState<string>(() => {
    const now = new Date()
    return `${now.toLocaleDateString('en-GB')} at ${now.toLocaleTimeString('en-GB')}`
  })

  // Interactive Troubleshooting state
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(() => {
    try {
      const savedSteps = sessionStorage.getItem('propsight_completed_steps')
      return savedSteps ? JSON.parse(savedSteps) : {}
    } catch {
      return {}
    }
  })

  const [outcome, setOutcome] = useState<OutcomeType>(() => {
    try {
      return (sessionStorage.getItem('propsight_outcome') as OutcomeType) || null
    } catch {
      return null
    }
  })

  // Save completed steps to sessionStorage
  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps((prev) => {
      const next = { ...prev, [stepNum]: !prev[stepNum] }
      sessionStorage.setItem('propsight_completed_steps', JSON.stringify(next))
      return next
    })
  }

  // Switch demo scenario directly from Results
  const switchSample = (sample: SampleIssue) => {
    const nextSub: UserSubmission = {
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
      timestamp: getNowIso(),
    }
    setSubmission(nextSub)
    sessionStorage.setItem('propsight_submission', JSON.stringify(nextSub))
    sessionStorage.removeItem('propsight_completed_steps')
    sessionStorage.removeItem('propsight_outcome')
    setCompletedSteps({})
    setOutcome(null)
    setActiveStepIndex(0)
  }

  // Evaluate assessment via modular rule-based engine
  const assessment = useMemo(() => {
    return evaluateAssessment(submission)
  }, [submission])

  // Priority badge styling
  const priorityStyles: Record<
    PriorityLevel,
    { badge: string; border: string; bg: string; icon: typeof CheckCircle2 }
  > = {
    LOW: {
      badge: 'bg-[#16C784]/10 text-[#0fa868] border-[#16C784]/30',
      border: 'border-[#16C784]/30',
      bg: 'bg-[#16C784]/5',
      icon: CheckCircle2,
    },
    MODERATE: {
      badge: 'bg-[#F5A623]/10 text-[#c27f0e] border-[#F5A623]/30',
      border: 'border-[#F5A623]/30',
      bg: 'bg-[#F5A623]/5',
      icon: AlertTriangle,
    },
    HIGH: {
      badge: 'bg-red-50 text-red-600 border-red-200',
      border: 'border-red-200',
      bg: 'bg-red-50/50',
      icon: AlertCircle,
    },
  }

  const pConfig = priorityStyles[assessment.priority]
  const PriorityIcon = pConfig.icon

  const currentStep = assessment.troubleshootingSteps[activeStepIndex]
  const isFinalStep = activeStepIndex === assessment.troubleshootingSteps.length - 1

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF] py-10 print:bg-white print:py-0">
      {/* Background grid for screen only */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] print:hidden"
        style={{
          backgroundImage:
            'linear-gradient(#3478F6 1px, transparent 1px), linear-gradient(90deg, #3478F6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Direct URL Fallback Banner */}
        {isUsingFallback && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle size={18} className="text-amber-600 shrink-0" />
              <span>
                <strong>Sample Demonstration Data:</strong> No recent submission was detected in this session. Viewing simulated demo.
              </span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/analyze')}
              className="shrink-0 bg-white"
            >
              Analyze Your Own Property
            </Button>
          </div>
        )}

        {/* Prototype AI Output Disclaimer Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E5EBF7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7] flex items-center justify-center shrink-0 text-[#3478F6]">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
                Prototype Demonstration
              </p>
              <p className="text-xs text-[#5D79C7] leading-relaxed">
                Prototype demonstration: this assessment uses simulated logic and is not a professional inspection.
              </p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            title="Print or save assessment summary"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5EBF7] text-xs font-semibold text-[#142039] hover:bg-[#F4F7FF] transition-colors print:hidden shrink-0"
          >
            <Printer size={14} className="text-[#3478F6]" />
            Print Report
          </button>
        </div>

        {/* Demonstration Switcher for Judges */}
        <div className="mb-8 p-3 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7] flex flex-wrap items-center justify-between gap-2 print:hidden text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#142039]">
            <Sparkles size={14} className="text-[#3478F6]" />
            <span>Judge Demo Controls:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_ISSUES.slice(0, 3).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => switchSample(s)}
                className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                  submission.issueCategory === s.category
                    ? 'bg-[#3478F6] text-white border-[#3478F6]'
                    : 'bg-white text-[#1D2A49] border-[#E5EBF7] hover:border-[#3478F6]/50'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142039] tracking-tight">
              Your Property Assessment
            </h1>
            <p className="text-[#5D79C7] text-base mt-2">
              Here are the visible signs and the next steps worth considering.
            </p>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2 print:hidden">
            <button
              onClick={() => navigate('/analyze')}
              className="text-xs font-medium text-[#5D79C7] hover:text-[#3478F6] flex items-center gap-1"
            >
              <RotateCcw size={12} /> Edit submission
            </button>
          </div>
        </div>

        {/* Submitted Issue Summary Card */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Uploaded photo if available */}
            {submission.hasImage && submission.imagePreview ? (
              <div className="md:w-5/12 shrink-0">
                <p className="text-xs font-bold uppercase tracking-widest text-[#5D79C7] mb-2 flex items-center gap-1.5">
                  <Camera size={13} className="text-[#3478F6]" /> Submitted Photo
                </p>
                <div className="relative rounded-xl overflow-hidden border border-[#E5EBF7] bg-slate-50">
                  <img
                    src={submission.imagePreview}
                    alt="User submitted property problem"
                    className="w-full max-h-56 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium rounded-md">
                    Observed for preliminary triage
                  </div>
                </div>
              </div>
            ) : null}

            {/* Overview details */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#5D79C7]">
                  Selected Category
                </span>
                <h2 className="text-2xl font-bold text-[#142039] mt-0.5">
                  {assessment.reportedIssue}
                </h2>
              </div>

              {/* Metadata chips */}
              <div className="flex flex-wrap gap-2 text-xs">
                {submission.location && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F4F7FF] border border-[#E5EBF7] text-[#142039] font-medium">
                    <MapPin size={13} className="text-[#3478F6]" />
                    {submission.location}
                  </span>
                )}
                {submission.firstNoticed && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F4F7FF] border border-[#E5EBF7] text-[#142039] font-medium">
                    <Clock size={13} className="text-[#3478F6]" />
                    First noticed: {submission.firstNoticed}
                  </span>
                )}
                {submission.gettingWorse && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F4F7FF] border border-[#E5EBF7] text-[#142039] font-medium">
                    Getting worse: {submission.gettingWorse}
                  </span>
                )}
                {submission.afterRainOrPlumbing && submission.afterRainOrPlumbing !== 'Not sure' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F4F7FF] border border-[#E5EBF7] text-[#142039] font-medium">
                    Trigger: {submission.afterRainOrPlumbing}
                  </span>
                )}
              </div>

              {/* Description quote */}
              <div className="bg-[#F4F7FF] rounded-xl p-3.5 border border-[#E5EBF7]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5D79C7] mb-1">
                  User Reported Description
                </p>
                <p className="text-sm text-[#1D2A49] italic leading-relaxed">
                  &ldquo;{submission.description}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 2: PRIORITY INDICATOR */}
        <div className={`mb-8 p-6 rounded-2xl border ${pConfig.border} ${pConfig.bg} shadow-xs`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-white shadow-xs border ${pConfig.border}`}>
                <PriorityIcon size={22} className={pConfig.badge.includes('red') ? 'text-red-500' : pConfig.badge.includes('16C784') ? 'text-[#16C784]' : 'text-[#F5A623]'} />
              </div>
              <div>
                <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1 ${pConfig.badge}`}>
                  {assessment.priority} PRIORITY
                </span>
                <h3 className="text-lg font-bold text-[#142039]">
                  {assessment.priorityTitle}
                </h3>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#1D2A49] leading-relaxed mb-3">
            {assessment.priorityDescription}
          </p>
          <div className="p-3 bg-white/80 rounded-xl border border-[#E5EBF7] text-xs text-[#5D79C7] leading-relaxed">
            <strong>Important triage notice:</strong> This priority indicator is a preliminary triage classification based on user-provided observations. It is not a certified structural, environmental, or medical diagnosis. A high-priority classification must not be disregarded or downgraded.
          </div>
        </div>

        {/* SECTION 1: PRELIMINARY FINDINGS */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-[#142039] mb-4 pb-3 border-b border-[#E5EBF7]">
            Section 1: Preliminary Findings
          </h2>

          <div className="space-y-6">
            {/* Symptoms split: User Reported vs Simulated Visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3478F6] mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> User-Reported Symptoms
                </h3>
                <ul className="space-y-2 text-xs text-[#1D2A49] leading-relaxed">
                  {assessment.userReportedSymptoms.map((sym, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3478F6] mt-1.5 shrink-0" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3478F6] mb-2.5 flex items-center gap-1.5">
                  <Camera size={14} /> Simulated Visual Observations
                </h3>
                <ul className="space-y-2 text-xs text-[#1D2A49] leading-relaxed">
                  {assessment.visibleSymptoms.map((vs, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5D79C7] mt-1.5 shrink-0" />
                      <span>{vs}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Possible explanations using cautious wording */}
            <div>
              <h3 className="text-sm font-bold text-[#142039] mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-[#3478F6]" />
                Possible Explanations
                <span className="text-xs font-normal text-[#5D79C7]">(Theoretical causes to investigate)</span>
              </h3>
              <div className="space-y-2">
                {assessment.possibleExplanations.map((exp, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-[#E5EBF7] bg-white text-sm text-[#1D2A49] leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="text-[#3478F6] font-bold text-xs mt-0.5">•</span>
                    <span>{exp}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#5D79C7] italic mt-2">
                Based on the information provided, an inspection may be needed to confirm the root cause before undertaking major remedial works.
              </p>
            </div>

            {/* Missing information */}
            {assessment.missingInformation.length > 0 && (
              <div className="p-4 rounded-xl border border-dashed border-[#E5EBF7] bg-white">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5D79C7] mb-2">
                  Information Required for Confirmatory Diagnosis
                </h3>
                <ul className="space-y-1.5 text-xs text-[#5D79C7] leading-relaxed">
                  {assessment.missingInformation.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#F5A623]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended next step */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
              <ShieldCheck size={20} className="text-[#3478F6] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#3478F6] mb-0.5">
                  Recommended Immediate Next Step
                </p>
                <p className="text-sm text-[#142039] font-medium leading-relaxed">
                  {assessment.recommendedNextStep}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 3 & 4: GUIDED INTERACTIVE TROUBLESHOOTING */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#E5EBF7]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3478F6] uppercase tracking-wider">
                <ShieldCheck size={14} /> Guided Safe Troubleshooting
              </div>
              <h2 className="text-xl font-bold text-[#142039] mt-0.5">
                Step-by-Step Investigation
              </h2>
            </div>
            <div className="text-xs text-[#5D79C7]">
              Step <span className="font-bold text-[#142039]">{activeStepIndex + 1}</span> of{' '}
              <span className="font-bold text-[#142039]">{assessment.troubleshootingSteps.length}</span>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 mb-6">
            {assessment.troubleshootingSteps.map((s, idx) => {
              const isDone = completedSteps[s.stepNumber]
              const isCurrent = idx === activeStepIndex
              return (
                <button
                  key={s.stepNumber}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex-1 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3478F6] ${
                    isDone
                      ? 'bg-[#16C784]'
                      : isCurrent
                      ? 'bg-[#3478F6]'
                      : 'bg-[#E5EBF7]'
                  }`}
                  aria-label={`Jump to step ${idx + 1}`}
                />
              )
            })}
          </div>

          {/* Current Step Interactive Card */}
          {currentStep && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-[#E5EBF7] bg-[#F4F7FF] relative">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-[#3478F6] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {currentStep.stepNumber}
                  </span>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#142039] cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#E5EBF7] hover:border-[#3478F6]/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={!!completedSteps[currentStep.stepNumber]}
                      onChange={() => toggleStepCompleted(currentStep.stepNumber)}
                      className="accent-[#3478F6] rounded"
                    />
                    <span>Mark as completed</span>
                  </label>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#142039] leading-snug mb-3">
                  {currentStep.instruction}
                </h3>

                <div className="pt-3 border-t border-[#E5EBF7]/80">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5D79C7] mb-1">
                    Why this matters:
                  </p>
                  <p className="text-xs sm:text-sm text-[#5D79C7] leading-relaxed">
                    {currentStep.whyItMatters}
                  </p>
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1.5"
                >
                  <ChevronLeft size={16} /> Previous Step
                </Button>

                {!isFinalStep ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!completedSteps[currentStep.stepNumber]) {
                        toggleStepCompleted(currentStep.stepNumber)
                      }
                      setActiveStepIndex((prev) =>
                        Math.min(assessment.troubleshootingSteps.length - 1, prev + 1)
                      )
                    }}
                    className="flex items-center gap-1.5"
                  >
                    Next Step <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!completedSteps[currentStep.stepNumber]) {
                        toggleStepCompleted(currentStep.stepNumber)
                      }
                      document.getElementById('troubleshooting-outcome')?.scrollIntoView({
                        behavior: 'smooth',
                      })
                    }}
                    className="bg-[#16C784] hover:bg-[#13af74] flex items-center gap-1.5 text-white"
                  >
                    Finish Steps &amp; Evaluate
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* SECTION 5: OUTCOME EVALUATION & DECISION LOGIC */}
          <div
            id="troubleshooting-outcome"
            className="mt-10 pt-8 border-t border-[#E5EBF7] space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
                Step Completion Check
              </span>
              <h3 className="text-lg font-bold text-[#142039] mt-0.5">
                Has the issue improved after checking the steps?
              </h3>
              <p className="text-xs text-[#5D79C7] mt-1">
                Please select the option that best reflects the current situation on site.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'resolved',
                  label: 'Yes, the issue appears resolved.',
                  color: 'hover:border-[#16C784]',
                  active: outcome === 'resolved' ? 'border-[#16C784] bg-[#16C784]/5 text-[#142039]' : '',
                },
                {
                  id: 'improved_present',
                  label: 'It has improved but is still present.',
                  color: 'hover:border-[#3478F6]',
                  active: outcome === 'improved_present' ? 'border-[#3478F6] bg-[#3478F6]/5 text-[#142039]' : '',
                },
                {
                  id: 'no_improvement',
                  label: 'No, the issue remains.',
                  color: 'hover:border-[#F5A623]',
                  active: outcome === 'no_improvement' ? 'border-[#F5A623] bg-[#F5A623]/5 text-[#142039]' : '',
                },
                {
                  id: 'getting_worse',
                  label: 'The problem appears to be getting worse.',
                  color: 'hover:border-red-400',
                  active: outcome === 'getting_worse' ? 'border-red-400 bg-red-50 text-red-900' : '',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    const chosen = opt.id as OutcomeType
                    setOutcome(chosen)
                    sessionStorage.setItem('propsight_outcome', chosen || '')
                  }}
                  className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all duration-150 ${opt.active || 'border-[#E5EBF7] bg-white text-[#1D2A49]'} ${opt.color} focus:outline-none focus:ring-2 focus:ring-[#3478F6]`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Dynamic Advice Based on Decision Logic */}
            {outcome === 'resolved' && (
              <div className="p-5 rounded-2xl bg-[#16C784]/10 border border-[#16C784]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#0fa868] font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>Observation Completed — Safe to Monitor</span>
                </div>
                <p className="text-sm text-[#142039] leading-relaxed">
                  While surface conditions appear to have settled, <strong>apparent improvement does not always confirm that the underlying cause is permanently resolved</strong>. For example, dried moisture patches may reactivate during the next prolonged rainstorm or seasonal shift.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-[#16C784]/40 text-xs font-semibold text-[#142039] hover:bg-[#16C784]/20 transition-colors"
                  >
                    <Printer size={14} className="text-[#16C784]" /> Save or Print Summary
                  </button>
                </div>
              </div>
            )}

            {outcome === 'improved_present' && (
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 text-[#3478F6] font-bold text-sm">
                  <ShieldCheck size={18} />
                  <span>Partial Improvement — Periodic Monitoring Advised</span>
                </div>
                <p className="text-sm text-[#142039] leading-relaxed">
                  The visible symptoms have reduced, but the condition persists. We recommend inspecting the area every 48 hours. If the cause remains uncertain or if damp or movement resumes, request a professional trade assessment.
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => navigate('/professional-help')}
                    className="flex items-center gap-1.5"
                  >
                    Request Professional Inspection <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            )}

            {outcome === 'no_improvement' && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <AlertTriangle size={18} />
                  <span>Issue Remains Unresolved — Professional Assistance Recommended</span>
                </div>
                <p className="text-sm text-amber-950 leading-relaxed">
                  Safe exploratory troubleshooting has not mitigated the condition. Further DIY investigation risks disturbing structural or plumbing fabric. We advise preparing a structured request for a qualified surveyor or trade professional.
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => navigate('/professional-help')}
                    className="bg-[#3478F6] flex items-center gap-1.5"
                  >
                    <PhoneCall size={14} /> Request Professional Assistance
                  </Button>
                </div>
              </div>
            )}

            {outcome === 'getting_worse' && (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-3">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <AlertCircle size={18} />
                  <span>Condition Worsening — Stop Ordinary Troubleshooting</span>
                </div>
                <p className="text-sm text-red-950 leading-relaxed">
                  <strong>Do not attempt further DIY measures.</strong> Actively spreading leaks, widening cracks, or bulging ceilings require immediate professional evaluation to safeguard property and personal safety.
                </p>
                <div className="p-3 bg-white/90 rounded-xl border border-red-200 text-xs text-red-800 leading-relaxed">
                  <Flame size={14} className="inline mr-1 text-red-500" />
                  If you observe water in contact with consumer units or wiring, evacuate the room and contact an emergency electrician. For strong gas odours, leave the premises and dial 0800 111 999.
                </div>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => navigate('/professional-help')}
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5"
                  >
                    <PhoneCall size={14} /> Connect With an Expert Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* SECTION 6: ESCALATION & ACTION BUTTONS */}
        <div className="mb-12 p-6 rounded-2xl bg-white border border-[#E5EBF7] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div>
            <h3 className="text-base font-bold text-[#142039]">
              Next Steps for Your Property
            </h3>
            <p className="text-xs text-[#5D79C7] mt-0.5">
              Review troubleshooting records, generate a print report, or request specialist quotes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setActiveStepIndex(0)
                document.getElementById('troubleshooting-outcome')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
              className="flex-1 sm:flex-none"
            >
              Review Steps
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5"
            >
              <Printer size={15} /> Save Assessment
            </Button>

            <Button
              size="md"
              onClick={() => navigate('/professional-help')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 ${
                assessment.priority === 'HIGH' || outcome === 'getting_worse' || outcome === 'no_improvement'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#3478F6]'
              }`}
            >
              <PhoneCall size={15} /> Get Professional Help
            </Button>
          </div>
        </div>

        {/* SECTION 7: PRINTABLE ASSESSMENT SUMMARY (Always visible during print) */}
        <div className="hidden print:block p-8 border-2 border-slate-300 rounded-xl space-y-6 text-black bg-white">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">PropSight AI — Preliminary Assessment Report</h2>
            <p className="text-xs text-slate-500 mt-1">
              Generated: {generatedDate}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-slate-700">Reported Category:</p>
              <p>{assessment.reportedIssue}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-700">Priority Level:</p>
              <p>{assessment.priority} PRIORITY ({assessment.priorityTitle})</p>
            </div>
            <div>
              <p className="font-semibold text-slate-700">Location:</p>
              <p>{submission.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-700">First Observed:</p>
              <p>{submission.firstNoticed || 'Not specified'}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-slate-700 text-sm">Submitted Description:</p>
            <p className="text-sm italic bg-slate-50 p-2.5 rounded mt-1 border">
              &ldquo;{submission.description}&rdquo;
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-700 text-sm">Troubleshooting Steps Completed:</p>
            <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
              {assessment.troubleshootingSteps.map((s) => (
                <li key={s.stepNumber}>
                  Step {s.stepNumber}: {s.instruction} —{' '}
                  <strong>{completedSteps[s.stepNumber] ? 'Completed' : 'Not marked complete'}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-slate-700 text-sm">User Reported Outcome:</p>
            <p className="text-sm mt-0.5">
              {outcome ? outcome.replace(/_/g, ' ').toUpperCase() : 'In Progress / Not finalized'}
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-700 text-sm">Recommended Next Action:</p>
            <p className="text-sm mt-0.5">{assessment.recommendedNextStep}</p>
          </div>

          <div className="border-t pt-4 text-xs text-slate-500 space-y-1 leading-relaxed">
            <p className="font-bold">Assessment Limitations &amp; Legal Notice:</p>
            <p>
              Prototype demonstration: this assessment uses simulated logic and is not a professional inspection. It does not constitute a formal building survey, RICS structural appraisal, or diagnostic confirmation. Always verify defect origins through an in-person inspection by a qualified tradesperson or chartered building surveyor.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
