import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Printer,
  Copy,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  FileText,
  Wrench,
  Flame,
  Edit2,
  Check,
} from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import {
  evaluateAssessment,
  type UserSubmission,
} from '../utils/assessmentEngine'
import {
  submitServiceRequestAPI,
  type RequestType,
  type ServiceRequestRecord,
} from '../utils/serviceRequestAPI'

// Fallback if accessed directly
const FALLBACK_SUBMISSION: UserSubmission = {
  issueCategory: 'Damp or Moisture',
  description:
    'Yellowish damp patch appearing on living room ceiling approximately 35cm across, noticeable following recent heavy rainfall.',
  location: 'Living room',
  firstNoticed: 'Within the past week',
  gettingWorse: 'Yes',
  happenedBefore: 'No',
  propertyType: 'Terraced house',
  affectedArea: '35 cm ceiling patch',
  afterRainOrPlumbing: 'After rain',
  wideningCrack: 'No',
  hasImage: false,
  imagePreview: null,
  timestamp: new Date().toISOString(),
}

interface RequestTypeOption {
  id: RequestType
  title: string
  subtitle: string
  icon: typeof Wrench
  badge?: string
}

const REQUEST_TYPES: RequestTypeOption[] = [
  {
    id: 'inspection',
    title: 'Request an Inspection',
    subtitle: 'Comprehensive on-site assessment by a qualified trade specialist or surveyor to diagnose the root cause.',
    icon: Wrench,
  },
  {
    id: 'quote',
    title: 'Request a Repair Quote',
    subtitle: 'Pricing estimate for remedying known defects, replacing components, or carrying out specified repairs.',
    icon: FileText,
  },
  {
    id: 'advice',
    title: 'Seek Advice on Next Steps',
    subtitle: 'Pre-repair consultation to understand diagnostic options, warranty claims, or tenant/landlord responsibility.',
    icon: HelpCircle,
  },
  {
    id: 'urgent',
    title: 'Report an Urgent Maintenance Issue',
    subtitle: 'Expedited attention for rapidly worsening problems where safe DIY observation has reached its limit.',
    icon: AlertCircle,
    badge: 'Urgent',
  },
]

export default function ProfessionalHelp() {
  const navigate = useNavigate()

  // Initialize state directly from sessionStorage with lazy initializers to avoid setState in effect
  const [submission] = useState<UserSubmission>(() => {
    const raw = sessionStorage.getItem('propsight_submission')
    if (raw) {
      try {
        return JSON.parse(raw) as UserSubmission
      } catch {
        return FALLBACK_SUBMISSION
      }
    }
    return FALLBACK_SUBMISSION
  })

  const [completedStepsCount] = useState<number>(() => {
    try {
      const savedSteps = sessionStorage.getItem('propsight_completed_steps')
      if (savedSteps) {
        const parsed = JSON.parse(savedSteps) as Record<number, boolean>
        return Object.values(parsed).filter(Boolean).length
      }
    } catch {
      // ignore
    }
    return 0
  })

  const [reportedOutcome] = useState<string>(() => {
    const savedOutcome = sessionStorage.getItem('propsight_outcome')
    if (savedOutcome) {
      const labels: Record<string, string> = {
        resolved: 'Appears resolved (monitoring recommended)',
        improved_present: 'Improved but still present',
        no_improvement: 'No improvement — issue persists',
        getting_worse: 'Getting worse (urgent attention advised)',
      }
      return labels[savedOutcome] || savedOutcome
    }
    return 'Not evaluated'
  })

  // Fixed timestamp initialized once to avoid impure Date() in render
  const [generatedDate] = useState<string>(() => {
    const now = new Date()
    return `${now.toLocaleDateString('en-GB')} at ${now.toLocaleTimeString('en-GB')}`
  })

  // Editable issue state
  const [isEditingIssue, setIsEditingIssue] = useState<boolean>(false)
  const [editedCategory, setEditedCategory] = useState<string>(
    () => submission.issueCategory || submission.category || 'Damp or Moisture'
  )
  const [editedLocation, setEditedLocation] = useState<string>(
    () => submission.location || 'Living room'
  )
  const [editedDescription, setEditedDescription] = useState<string>(
    () => submission.description || ''
  )

  // Form Details
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [postcode, setPostcode] = useState<string>('')
  const [preferredContact, setPreferredContact] = useState<string>('email')
  const [additionalNotes, setAdditionalNotes] = useState<string>('')
  const [requestType, setRequestType] = useState<RequestType>('inspection')

  // Validation & UI State
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [generatedRef, setGeneratedRef] = useState<string>('')
  const [copiedRef, setCopiedRef] = useState<boolean>(false)

  const assessment = evaluateAssessment(submission)
  const totalStepsCount = assessment.troubleshootingSteps.length || 4

  // Validate form
  const validate = (): boolean => {
    const errs: Record<string, string> = {}

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address.'
    }

    const cleanPostcode = postcode.trim().toUpperCase()
    // Standard UK postcode regex
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i
    if (!cleanPostcode) {
      errs.postcode = 'UK postcode is required to identify local service providers.'
    } else if (!ukPostcodeRegex.test(cleanPostcode)) {
      errs.postcode = 'Please enter a valid UK postcode format (e.g. SW1A 1AA, M1 1AE).'
    }

    // Phone is required if preferredContact is phone, sms, or whatsapp
    if (preferredContact === 'phone' || preferredContact === 'whatsapp' || preferredContact === 'sms') {
      const digitsOnly = phone.replace(/\D/g, '')
      if (!phone.trim() || digitsOnly.length < 10) {
        errs.phone = `Phone number is required when ${preferredContact === 'whatsapp' ? 'WhatsApp' : preferredContact === 'sms' ? 'SMS' : 'phone call'} is selected.`
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      window.scrollTo({ top: 380, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    // Generate readable UK reference number: PROP-UK-XXXXX
    const randomDigits = Math.floor(10000 + Math.random() * 90000)
    const ref = `PROP-UK-${randomDigits}`

    const record: ServiceRequestRecord = {
      referenceNumber: ref,
      createdAt: new Date().toISOString(),
      requestType,
      contact: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        postcode: postcode.trim().toUpperCase(),
        preferredContact,
        additionalNotes: additionalNotes.trim() || undefined,
      },
      issue: {
        category: editedCategory,
        location: editedLocation,
        description: editedDescription,
        priority: assessment.priority,
        stepsCompletedCount: completedStepsCount,
        totalStepsCount,
        outcomeReported: reportedOutcome,
        hasImage: !!submission.hasImage,
      },
    }

    await submitServiceRequestAPI(record)

    setGeneratedRef(ref)
    setIsSubmitting(false)
    setIsSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copyToClipboard = () => {
    if (generatedRef) {
      navigator.clipboard.writeText(generatedRef)
      setCopiedRef(true)
      setTimeout(() => setCopiedRef(false), 2500)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Check if urgent or safety trigger
  const isUrgentSelected = requestType === 'urgent'
  const isHighPriority = assessment.priority === 'HIGH'
  const isGasSmell = submission.description.toLowerCase().includes('gas') || submission.issueCategory === 'Heating & Boiler'

  // ─────────────────────────────────────────────────────────────────────────────
  // SUCCESS SCREEN (Section 7)
  // ─────────────────────────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F4F7FF] py-12 print:bg-white print:py-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E5EBF7] p-8 sm:p-10 shadow-xs space-y-8">
            {/* Header pill */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-[#16C784]/10 border border-[#16C784]/20 rounded-2xl flex items-center justify-center mx-auto text-[#16C784]">
                <CheckCircle2 size={36} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142039]">
                Your Request Summary Is Ready
              </h1>
              <p className="text-sm sm:text-base text-[#5D79C7] max-w-xl mx-auto leading-relaxed">
                Your information has been organised into a service request. This demonstration has not sent it to a contractor.
              </p>
            </div>

            {/* Reference Badge Card */}
            <div className="p-5 rounded-2xl bg-[#F4F7FF] border border-[#E5EBF7] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#5D79C7]">
                  Demonstration Reference Number
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2xl font-black tracking-tight text-[#142039] font-mono">
                    {generatedRef}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 rounded-lg border border-[#E5EBF7] bg-white text-xs text-[#3478F6] hover:bg-[#F4F7FF] transition-colors flex items-center gap-1 font-medium print:hidden"
                    title="Copy reference number"
                  >
                    {copiedRef ? <Check size={14} className="text-[#16C784]" /> : <Copy size={14} />}
                    {copiedRef ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-[#8BA3D4] mt-1">
                  Generated locally on {generatedDate}
                </p>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <Button variant="secondary" size="sm" onClick={handlePrint} className="flex items-center gap-1.5 bg-white">
                  <Printer size={15} /> Print Summary
                </Button>
              </div>
            </div>

            {/* Summary Details Grid */}
            <div className="space-y-4 pt-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#5D79C7]">
                Service Request Summary
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl border border-[#E5EBF7] bg-white">
                  <p className="text-xs text-[#5D79C7] font-semibold">Request Type</p>
                  <p className="text-[#142039] font-bold mt-0.5 capitalize">
                    {REQUEST_TYPES.find((r) => r.id === requestType)?.title}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[#E5EBF7] bg-white">
                  <p className="text-xs text-[#5D79C7] font-semibold">Contact &amp; Postcode</p>
                  <p className="text-[#142039] font-bold mt-0.5">
                    {fullName} &middot; <span className="font-mono">{postcode}</span>
                  </p>
                  <p className="text-xs text-[#5D79C7] mt-0.5">
                    Preferred via {preferredContact} ({email})
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[#E5EBF7] bg-white">
                  <p className="text-xs text-[#5D79C7] font-semibold">Issue Category &amp; Location</p>
                  <p className="text-[#142039] font-bold mt-0.5">
                    {editedCategory}
                  </p>
                  <p className="text-xs text-[#5D79C7] mt-0.5">
                    Located in: {editedLocation}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[#E5EBF7] bg-white">
                  <p className="text-xs text-[#5D79C7] font-semibold">Assessment Triage Priority</p>
                  <p className="text-[#142039] font-bold mt-0.5 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${assessment.priority === 'HIGH' ? 'bg-red-500' : assessment.priority === 'MODERATE' ? 'bg-[#F5A623]' : 'bg-[#16C784]'}`} />
                    {assessment.priority} Priority
                  </p>
                  <p className="text-xs text-[#5D79C7] mt-0.5">
                    Troubleshooting: {completedStepsCount} of {totalStepsCount} steps completed
                  </p>
                </div>
              </div>

              {/* Description quote */}
              <div className="p-4 rounded-xl border border-[#E5EBF7] bg-[#F4F7FF]">
                <p className="text-xs font-semibold text-[#5D79C7] uppercase tracking-wider mb-1">
                  Issue Description &amp; Notes
                </p>
                <p className="text-sm text-[#142039] italic leading-relaxed">
                  &ldquo;{editedDescription}&rdquo;
                </p>
                {additionalNotes && (
                  <p className="text-xs text-[#5D79C7] mt-2 pt-2 border-t border-[#E5EBF7]">
                    <strong>Additional Notes:</strong> {additionalNotes}
                  </p>
                )}
              </div>
            </div>

            {/* Next Steps for User */}
            <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/60 space-y-3">
              <h3 className="text-sm font-bold text-[#142039] flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#3478F6]" />
                What to Prepare Before a Professional Arrives
              </h3>
              <ul className="text-xs sm:text-sm text-[#1D2A49] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#3478F6] font-bold">•</span>
                  <span><strong>Clear access:</strong> Ensure safe access to lofts, stopcocks, meter cupboards, or exterior walls before the trade professional arrives.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3478F6] font-bold">•</span>
                  <span><strong>Maintain photo log:</strong> Keep your photo and date records ready to show the rate of spread or staining changes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3478F6] font-bold">•</span>
                  <span><strong>Tenancy &amp; insurance:</strong> If renting, forward this summary to your landlord or managing agent in writing to establish a dated record.</span>
                </li>
              </ul>
            </div>

            {/* Prototype notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Prototype demonstration:</strong> this assessment uses simulated logic and is not a professional inspection. No actual contractor booking has been executed.
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5EBF7] print:hidden">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/results')}
                className="flex items-center justify-center gap-2 flex-1"
              >
                <RotateCcw size={16} /> Return to Assessment
              </Button>
              <Button
                size="md"
                onClick={() => navigate('/analyze')}
                className="flex items-center justify-center gap-2 flex-1"
              >
                Start New Property Analysis <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN FORM PAGE
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4F7FF] py-12">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(#3478F6 1px, transparent 1px), linear-gradient(90deg, #3478F6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5EBF7] text-[#3478F6] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-xs">
            <PhoneCall size={12} />
            Service Escalation
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#142039] tracking-tight">
            Let's Get Your Property Issue Sorted
          </h1>
          <p className="text-[#5D79C7] text-base sm:text-lg max-w-xl mx-auto mt-3 leading-relaxed">
            You've taken the first step. Share a few details so the right professional can understand the problem.
          </p>
        </div>

        {/* SECTION 6: URGENT SAFETY NOTICE (if gas, high priority, or urgent type selected) */}
        {(isUrgentSelected || isHighPriority || isGasSmell) && (
          <div className="mb-8 p-6 rounded-3xl bg-red-50 border-2 border-red-200 shadow-xs space-y-4" role="alert">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                <Flame size={22} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-red-200 text-red-800 px-2.5 py-0.5 rounded-full">
                  Urgent Safety Notice
                </span>
                <h2 className="text-lg font-bold text-red-950 mt-1">
                  Do not rely on this form for emergency situations
                </h2>
                <p className="text-xs sm:text-sm text-red-800 leading-relaxed mt-1">
                  An online service request is designed for scheduling standard visits and quotes. It is <strong>not</strong> an emergency response service. If there is immediate danger to life or property:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white/90 border border-red-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-red-900">Suspected Gas Leak</p>
                  <p className="text-xs text-red-700">National Gas Emergency Service</p>
                </div>
                <a
                  href="tel:0800111999"
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Phone size={12} /> 0800 111 999
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-white/90 border border-red-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-red-900">Life Threat / Active Collapse</p>
                  <p className="text-xs text-red-700">UK Emergency Services</p>
                </div>
                <a
                  href="tel:999"
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Phone size={12} /> Dial 999
                </a>
              </div>
            </div>

            <p className="text-[11px] text-red-700 italic">
              Water near electrics? Do not touch affected switches; safely isolate at consumer unit if accessible without entering water.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* SECTION 1: ISSUE SUMMARY (Auto-populated from previous assessment) */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <Card>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E5EBF7]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
                  Section 1
                </span>
                <h2 className="text-lg font-bold text-[#142039]">
                  Issue Summary &amp; Preliminary Assessment
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingIssue(!isEditingIssue)}
                className="text-xs font-semibold text-[#3478F6] hover:text-[#4F8DFF] flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E5EBF7] hover:bg-[#F4F7FF] transition-colors"
              >
                <Edit2 size={13} /> {isEditingIssue ? 'Done Editing' : 'Edit Issue Details'}
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo preview if present */}
              {submission.hasImage && submission.imagePreview && (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7]">
                  <img
                    src={submission.imagePreview}
                    alt="Property issue reference preview"
                    className="w-16 h-16 rounded-lg object-cover border border-[#E5EBF7] shrink-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#142039]">Uploaded Reference Photo</p>
                    <p className="text-xs text-[#5D79C7] mt-0.5">
                      Attached to this request package for the attending professional.
                    </p>
                  </div>
                </div>
              )}

              {/* Editable or Display View */}
              {isEditingIssue ? (
                <div className="space-y-4 p-4 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7]">
                  <div>
                    <label className="block text-xs font-bold text-[#142039] mb-1">
                      Issue Category
                    </label>
                    <input
                      type="text"
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-lg border border-[#E5EBF7] bg-white text-[#142039] focus:ring-2 focus:ring-[#3478F6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#142039] mb-1">
                      Location in Property
                    </label>
                    <input
                      type="text"
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-lg border border-[#E5EBF7] bg-white text-[#142039] focus:ring-2 focus:ring-[#3478F6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#142039] mb-1">
                      Problem Description
                    </label>
                    <textarea
                      rows={3}
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-lg border border-[#E5EBF7] bg-white text-[#142039] focus:ring-2 focus:ring-[#3478F6]"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7]">
                    <span className="text-[#5D79C7] font-medium">Category:</span>
                    <p className="font-bold text-[#142039] text-sm mt-0.5">{editedCategory}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7]">
                    <span className="text-[#5D79C7] font-medium">Location in property:</span>
                    <p className="font-bold text-[#142039] text-sm mt-0.5">{editedLocation}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7]">
                    <span className="text-[#5D79C7] font-medium">Preliminary Triage Priority:</span>
                    <p className="font-bold text-[#142039] text-sm mt-0.5">
                      {assessment.priority} Priority ({assessment.priorityTitle})
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4F7FF] border border-[#E5EBF7]">
                    <span className="text-[#5D79C7] font-medium">Troubleshooting Attempted:</span>
                    <p className="font-bold text-[#142039] text-sm mt-0.5">
                      {completedStepsCount} of {totalStepsCount} steps completed
                    </p>
                    <p className="text-[11px] text-[#5D79C7] mt-0.5">Outcome: {reportedOutcome}</p>
                  </div>
                </div>
              )}

              {/* Description preview */}
              {!isEditingIssue && (
                <div className="p-3.5 rounded-xl border border-[#E5EBF7] bg-white">
                  <p className="text-xs font-semibold text-[#5D79C7] mb-1">Original Description:</p>
                  <p className="text-xs sm:text-sm text-[#1D2A49] italic leading-relaxed">
                    &ldquo;{editedDescription}&rdquo;
                  </p>
                </div>
              )}

              <div className="p-3 bg-white rounded-xl border border-[#E5EBF7] text-[11px] text-[#5D79C7] leading-relaxed">
                <strong>Prototype demonstration:</strong> this assessment uses simulated logic and is not a professional inspection. These details reflect self-reported observations and automated preliminary triage.
              </div>
            </div>
          </Card>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* SECTION 3: REQUEST TYPE */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <Card>
            <div className="pb-4 mb-5 border-b border-[#E5EBF7]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
                Section 2
              </span>
              <h2 className="text-lg font-bold text-[#142039]">
                What Type of Service Are You Requesting?
              </h2>
              <p className="text-xs text-[#5D79C7] mt-0.5">
                Select the option that matches your current goal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REQUEST_TYPES.map((type) => {
                const Icon = type.icon
                const isSelected = requestType === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setRequestType(type.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#3478F6] bg-[#F4F7FF] ring-2 ring-[#3478F6]/20 shadow-xs'
                        : 'border-[#E5EBF7] bg-white hover:border-[#3478F6]/40 hover:bg-[#F4F7FF]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-[#3478F6] text-white' : 'bg-[#F4F7FF] text-[#3478F6]'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        {type.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                            {type.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#142039]">{type.title}</h3>
                      <p className="text-xs text-[#5D79C7] mt-1 leading-relaxed">
                        {type.subtitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 flex items-center gap-1.5 text-xs font-semibold">
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#3478F6] bg-[#3478F6]' : 'border-[#C1D2F7]'}`}>
                        {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </span>
                      <span className={isSelected ? 'text-[#3478F6]' : 'text-[#5D79C7]'}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            <p className="text-xs text-[#8BA3D4] mt-4 leading-relaxed">
              * Note: This request is used to prepare an introductory dossier for local trade inquiries; it does not constitute a binding booking confirmation or date guarantee.
            </p>
          </Card>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* SECTION 2: REQUEST DETAILS (Contact info) */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <Card>
            <div className="pb-4 mb-5 border-b border-[#E5EBF7]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
                Section 3
              </span>
              <h2 className="text-lg font-bold text-[#142039]">
                Your Contact Information
              </h2>
              <p className="text-xs text-[#5D79C7] mt-0.5">
                We only ask for details required to correlate your location with local UK contractors.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-bold text-[#142039] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5D79C7]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value)
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }))
                      }}
                      placeholder="e.g. Alex Morgan"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-[#142039] placeholder-[#8BA3D4] focus:outline-none focus:ring-2 focus:ring-[#3478F6] ${
                        errors.fullName ? 'border-red-400 bg-red-50' : 'border-[#E5EBF7] bg-[#F4F7FF] focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-xs font-bold text-[#142039] mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5D79C7]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                      }}
                      placeholder="alex.morgan@example.co.uk"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-[#142039] placeholder-[#8BA3D4] focus:outline-none focus:ring-2 focus:ring-[#3478F6] ${
                        errors.email ? 'border-red-400 bg-red-50' : 'border-[#E5EBF7] bg-[#F4F7FF] focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* UK Postcode */}
                <div>
                  <label className="block text-xs font-bold text-[#142039] mb-1.5">
                    UK Postcode <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5D79C7]" />
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => {
                        setPostcode(e.target.value.toUpperCase())
                        if (errors.postcode) setErrors((prev) => ({ ...prev, postcode: '' }))
                      }}
                      placeholder="e.g. SW1A 1AA or M1 1AE"
                      maxLength={8}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-[#142039] placeholder-[#8BA3D4] uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#3478F6] ${
                        errors.postcode ? 'border-red-400 bg-red-50' : 'border-[#E5EBF7] bg-[#F4F7FF] focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.postcode && <p className="text-xs text-red-500 mt-1">{errors.postcode}</p>}
                </div>

                {/* Phone number */}
                <div>
                  <label className="block text-xs font-bold text-[#142039] mb-1.5">
                    Phone Number {preferredContact !== 'email' ? <span className="text-red-500">*</span> : <span className="text-[#8BA3D4] font-normal">(optional)</span>}
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5D79C7]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
                      }}
                      placeholder="07700 900123"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-[#142039] placeholder-[#8BA3D4] focus:outline-none focus:ring-2 focus:ring-[#3478F6] ${
                        errors.phone ? 'border-red-400 bg-red-50' : 'border-[#E5EBF7] bg-[#F4F7FF] focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Preferred contact method */}
              <div>
                <label className="block text-xs font-bold text-[#142039] mb-2">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'email', label: 'Email' },
                    { id: 'phone', label: 'Phone call' },
                    { id: 'sms', label: 'Text (SMS)' },
                    { id: 'whatsapp', label: 'WhatsApp' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPreferredContact(m.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        preferredContact === m.id
                          ? 'border-[#3478F6] bg-[#F4F7FF] text-[#3478F6]'
                          : 'border-[#E5EBF7] bg-white text-[#5D79C7] hover:border-[#3478F6]/40'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional notes */}
              <div>
                <label className="block text-xs font-bold text-[#142039] mb-1.5">
                  Additional Notes or Access Instructions <span className="text-[#8BA3D4] font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="e.g. Property has permit parking only; access best between 9am-12pm; tenant present on site..."
                    className="w-full p-3 rounded-xl border border-[#E5EBF7] bg-[#F4F7FF] focus:bg-white text-sm text-[#142039] placeholder-[#8BA3D4] focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* SECTION 4: REVIEW BEFORE SUBMISSION */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <Card className="bg-[#F4F7FF] border-[#E5EBF7]">
            <div className="pb-3 mb-4 border-b border-[#E5EBF7]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
                Section 4
              </span>
              <h2 className="text-base font-bold text-[#142039]">
                Review Before Submission
              </h2>
            </div>

            <div className="space-y-2 text-xs text-[#1D2A49]">
              <div className="flex justify-between py-1 border-b border-[#E5EBF7]/80">
                <span className="text-[#5D79C7]">Issue:</span>
                <span className="font-semibold text-right">{editedCategory} ({editedLocation})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5EBF7]/80">
                <span className="text-[#5D79C7]">Request Type:</span>
                <span className="font-semibold text-right">{REQUEST_TYPES.find((r) => r.id === requestType)?.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5EBF7]/80">
                <span className="text-[#5D79C7]">Contact details:</span>
                <span className="font-semibold text-right">
                  {fullName ? `${fullName} (${postcode || 'Postcode pending'})` : 'Please complete details above'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#5D79C7]">Triage Priority:</span>
                <span className="font-semibold text-right">{assessment.priority} Priority</span>
              </div>
            </div>
          </Card>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* SECTION 5: SUBMIT */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 text-base shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Preparing Service Dossier…
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} /> Submit Service Request
                </>
              )}
            </Button>

            <p className="text-center text-xs text-[#8BA3D4] leading-relaxed">
              * Demonstration prototype: Generates a printable inquiry dossier locally. No data is stored externally or transmitted to contractors.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
