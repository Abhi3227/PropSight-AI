import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Droplets,
  Leaf,
  ScanLine,
  Layers,
  CloudRain,
  Grid3X3,
  Umbrella,
  HelpCircle,
  Upload,
  X,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Phone,
  Flame,
  Zap,
  ShieldAlert,
  MapPin,
  Clock,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import { SAMPLE_ISSUES, type SampleIssue } from '../utils/sampleIssues'

// ─── Constants outside component for pure render & hook deps ──────────────────
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  // Step 1
  issueCategory: string
  // Step 2
  imagePreview: string | null
  imageName: string | null
  // Step 3
  description: string
  // Step 4
  location: string
  locationOther: string
  firstNoticed: string
  gettingWorse: string
  happenedBefore: string
  propertyType: string
  affectedArea: string
  afterRainOrPlumbing: string
  // Step 5 — safety
  waterNearElectrics: string
  unstableStructure: string
  rapidLeak: string
  gasSmell: string
  wideningCrack: string
}

const INITIAL_FORM: FormState = {
  issueCategory: '',
  imagePreview: null,
  imageName: null,
  description: '',
  location: '',
  locationOther: '',
  firstNoticed: '',
  gettingWorse: '',
  happenedBefore: '',
  propertyType: '',
  affectedArea: '',
  afterRainOrPlumbing: '',
  waterNearElectrics: '',
  unstableStructure: '',
  rapidLeak: '',
  gasSmell: '',
  wideningCrack: '',
}

// ─── Category List ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'Damp or Moisture', label: 'Damp or Moisture', icon: Droplets },
  { id: 'Mould-Like Growth', label: 'Mould-Like Growth', icon: Leaf },
  { id: 'Wall or Ceiling Cracks', label: 'Wall or Ceiling Cracks', icon: ScanLine },
  { id: 'Peeling Paint', label: 'Peeling Paint', icon: Layers },
  { id: 'Water Leakage', label: 'Water Leakage', icon: CloudRain },
  { id: 'Damaged Flooring', label: 'Damaged Flooring', icon: Grid3X3 },
  { id: 'Roof or Ceiling Damage', label: 'Roof or Ceiling Damage', icon: Umbrella },
  { id: 'Other', label: 'Other', icon: HelpCircle },
] as const

const LOCATIONS = ['Kitchen', 'Bathroom', 'Bedroom', 'Living room', 'Roof or attic', 'Exterior', 'Other']
const FIRST_NOTICED = ['Today', 'Within the past week', 'Within the past month', 'More than a month ago', 'Not sure']
const YES_NO_NOTSURE = ['Yes', 'No', 'Not sure']
const PROPERTY_TYPES = ['Detached house', 'Semi-detached house', 'Terraced house', 'Flat / Apartment', 'Bungalow', 'Other']

const TOTAL_STEPS = 5

// ─── Safety emergency detection ───────────────────────────────────────────────

type EmergencyType = 'gas' | 'electrics' | 'structure' | 'leak' | null

function detectEmergency(form: FormState): EmergencyType {
  if (form.gasSmell === 'Yes') return 'gas'
  if (form.waterNearElectrics === 'Yes') return 'electrics'
  if (form.unstableStructure === 'Yes') return 'structure'
  if (form.rapidLeak === 'Yes') return 'leak'
  return null
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepPill({ step, label, current, done }: { step: number; label: string; current: boolean; done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
          done
            ? 'bg-[#16C784] text-white'
            : current
            ? 'bg-[#3478F6] text-white ring-4 ring-[#3478F6]/20'
            : 'bg-[#E5EBF7] text-[#5D79C7]'
        }`}
      >
        {done ? <CheckCircle2 size={14} /> : step}
      </div>
      <span
        className={`text-[10px] font-semibold uppercase tracking-wide hidden sm:block ${
          current ? 'text-[#3478F6]' : done ? 'text-[#16C784]' : 'text-[#5D79C7]'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function ProgressBar({ current }: { current: number }) {
  const steps = ['Issue', 'Photo', 'Details', 'Context', 'Safety']
  return (
    <div className="mb-8">
      <div className="flex items-center gap-0">
        {steps.map((label, idx) => {
          const stepNum = idx + 1
          const done = stepNum < current
          const isCurrent = stepNum === current
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <StepPill step={stepNum} label={label} current={isCurrent} done={done} />
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 rounded-full overflow-hidden bg-[#E5EBF7]">
                  <div
                    className="h-full bg-[#3478F6] transition-all duration-500"
                    style={{ width: done ? '100%' : isCurrent ? '50%' : '0%' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5" role="alert">
      <AlertTriangle size={13} className="shrink-0" /> {msg}
    </p>
  )
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
  cols = 1,
}: {
  name: string
  options: string[]
  value: string
  onChange: (v: string) => void
  cols?: number
}) {
  return (
    <div
      className={`grid gap-2 ${
        cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-1'
      }`}
    >
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm font-medium select-none ${
            value === opt
              ? 'border-[#3478F6] bg-[#F4F7FF] text-[#142039]'
              : 'border-[#E5EBF7] text-[#5D79C7] hover:border-[#3478F6]/40 hover:bg-[#F4F7FF]/60'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="accent-[#3478F6] shrink-0"
          />
          {opt}
        </label>
      ))}
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function Step1Category({
  form,
  setForm,
  errors,
}: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  errors: Record<string, string>
}) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map(({ id, label, icon: Icon }) => {
          const selected = form.issueCategory === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setForm((f) => ({ ...f, issueCategory: id }))}
              aria-pressed={selected}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6] ${
                selected
                  ? 'border-[#3478F6] bg-[#F4F7FF] shadow-md scale-[1.02]'
                  : 'border-[#E5EBF7] bg-white hover:border-[#3478F6]/50 hover:bg-[#F4F7FF]/70 hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selected ? 'bg-[#3478F6]' : 'bg-[#F4F7FF] border border-[#E5EBF7]'
                }`}
              >
                <Icon size={22} className={selected ? 'text-white' : 'text-[#3478F6]'} />
              </div>
              <span
                className={`text-xs font-semibold leading-tight ${
                  selected ? 'text-[#3478F6]' : 'text-[#1D2A49]'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
      <FieldError msg={errors.issueCategory} />
    </div>
  )
}

function Step2Photo({
  form,
  setForm,
  errors,
  setErrors,
}: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  errors: Record<string, string>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrors((e) => ({ ...e, image: `Unsupported file type (${file.type || 'unknown'}). Please upload a JPEG, PNG or WebP image.` }))
        return
      }
      if (file.size > MAX_SIZE) {
        setErrors((e) => ({ ...e, image: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 10 MB.` }))
        return
      }
      const reader = new FileReader()
      reader.onload = (ev) => {
        setForm((f) => ({ ...f, imagePreview: ev.target?.result as string, imageName: file.name }))
        setErrors((e) => { const n = { ...e }; delete n.image; return n })
      }
      reader.readAsDataURL(file)
    },
    [setForm, setErrors]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const removeImage = () => {
    setForm((f) => ({ ...f, imagePreview: null, imageName: null }))
    setErrors((e) => { const n = { ...e }; delete n.image; return n })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      {form.imagePreview ? (
        <div className="relative rounded-2xl overflow-hidden border border-[#E5EBF7] group">
          <img
            src={form.imagePreview}
            alt="Uploaded property issue preview"
            className="w-full max-h-80 object-cover"
          />
          {/* Overlay buttons */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/90 hover:bg-white text-[#142039] rounded-full px-3 py-1.5 text-xs font-semibold shadow transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
              aria-label="Replace image"
            >
              <RotateCcw size={12} /> Replace
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="bg-white/90 hover:bg-red-50 text-red-500 rounded-full p-1.5 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 bg-white/90 text-[#142039] text-xs font-medium px-3 py-1.5 rounded-full shadow">
            📎 {form.imageName}
          </div>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          aria-label="Upload a photo of the issue"
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-[#3478F6] bg-[#EEF4FF] scale-[1.01]'
              : 'border-[#E5EBF7] hover:border-[#3478F6] hover:bg-[#F4F7FF]'
          } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6]`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors ${dragging ? 'bg-[#3478F6]' : 'bg-[#F4F7FF] border border-[#E5EBF7]'}`}>
            <Upload size={26} className={dragging ? 'text-white' : 'text-[#3478F6]'} />
          </div>
          <p className="text-[#142039] font-semibold text-base mb-1">
            {dragging ? 'Drop your photo here' : 'Drag & drop a photo here'}
          </p>
          <p className="text-[#5D79C7] text-sm mb-4">or click to browse your files</p>
          <span className="text-xs text-[#5D79C7] bg-white border border-[#E5EBF7] px-3 py-1.5 rounded-full shadow-xs">
            JPEG · PNG · WebP &nbsp;·&nbsp; Max 10 MB
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      {errors.image && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-2.5 items-start" role="alert">
          <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{errors.image}</p>
        </div>
      )}

      {!form.imagePreview && !errors.image && (
        <p className="text-sm text-center text-[#5D79C7]">
          A photo isn't required — you can{' '}
          <span className="font-medium text-[#3478F6]">continue without one</span> if you don't have one available.
        </p>
      )}
    </div>
  )
}

function Step3Description({
  form,
  setForm,
  errors,
}: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  errors: Record<string, string>
}) {
  const charCount = form.description.trim().length
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-semibold text-[#142039] mb-2">
        What have you noticed? <span className="text-red-500">*</span>
      </label>
      <textarea
        id="description"
        rows={6}
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        placeholder="Describe what you noticed, where it appeared, and anything that may have happened before it started."
        className={`w-full border rounded-xl px-4 py-3.5 text-sm text-[#142039] placeholder-[#8BA3D4] resize-none focus:outline-none focus:ring-2 focus:ring-[#3478F6] transition-shadow leading-relaxed ${
          errors.description
            ? 'border-red-400 bg-red-50'
            : 'border-[#E5EBF7] bg-[#F4F7FF] focus:bg-white'
        }`}
      />
      <div className="flex justify-between items-center mt-1.5">
        <FieldError msg={errors.description} />
        <span
          className={`text-xs ml-auto font-medium ${
            charCount === 0
              ? 'text-[#8BA3D4]'
              : charCount < 20
              ? 'text-[#F5A623]'
              : 'text-[#16C784]'
          }`}
        >
          {charCount} / 20 min
        </span>
      </div>
    </div>
  )
}

function Step4Context({
  form,
  setForm,
  errors,
}: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  errors: Record<string, string>
}) {
  const set = (key: keyof FormState, val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  return (
    <div className="space-y-7">
      {/* Location */}
      <div>
        <p className="text-sm font-semibold text-[#142039] mb-2.5 flex items-center gap-2">
          <MapPin size={14} className="text-[#3478F6]" />
          Where in the property? <span className="text-red-500">*</span>
        </p>
        <RadioGroup
          name="location"
          options={LOCATIONS.filter((l) => l !== 'Other')}
          value={form.location}
          onChange={(v) => set('location', v)}
          cols={2}
        />
        {/* Other option */}
        <label
          className={`mt-2 flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm font-medium ${
            form.location === 'Other'
              ? 'border-[#3478F6] bg-[#F4F7FF] text-[#142039]'
              : 'border-[#E5EBF7] text-[#5D79C7] hover:border-[#3478F6]/40'
          }`}
        >
          <input
            type="radio"
            name="location"
            value="Other"
            checked={form.location === 'Other'}
            onChange={() => set('location', 'Other')}
            className="accent-[#3478F6] shrink-0"
          />
          Other
        </label>
        {form.location === 'Other' && (
          <input
            type="text"
            value={form.locationOther}
            onChange={(e) => set('locationOther', e.target.value)}
            placeholder="Please specify…"
            className="mt-2 w-full border border-[#E5EBF7] bg-[#F4F7FF] focus:bg-white rounded-xl px-4 py-2.5 text-sm text-[#142039] placeholder-[#8BA3D4] focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
          />
        )}
        <FieldError msg={errors.location} />
      </div>

      {/* When first noticed */}
      <div>
        <p className="text-sm font-semibold text-[#142039] mb-2.5 flex items-center gap-2">
          <Clock size={14} className="text-[#3478F6]" />
          When did you first notice it? <span className="text-red-500">*</span>
        </p>
        <RadioGroup
          name="firstNoticed"
          options={FIRST_NOTICED}
          value={form.firstNoticed}
          onChange={(v) => set('firstNoticed', v)}
          cols={2}
        />
        <FieldError msg={errors.firstNoticed} />
      </div>

      {/* Getting worse */}
      <div>
        <p className="text-sm font-semibold text-[#142039] mb-2.5 flex items-center gap-2">
          <TrendingUp size={14} className="text-[#3478F6]" />
          Is it getting worse?
        </p>
        <RadioGroup
          name="gettingWorse"
          options={YES_NO_NOTSURE}
          value={form.gettingWorse}
          onChange={(v) => set('gettingWorse', v)}
          cols={3}
        />
      </div>

      {/* Happened before */}
      <div>
        <p className="text-sm font-semibold text-[#142039] mb-2.5 flex items-center gap-2">
          <RotateCcw size={14} className="text-[#3478F6]" />
          Has this happened before?
        </p>
        <RadioGroup
          name="happenedBefore"
          options={YES_NO_NOTSURE}
          value={form.happenedBefore}
          onChange={(v) => set('happenedBefore', v)}
          cols={3}
        />
      </div>

      {/* Optional fields */}
      <details className="group">
        <summary className="cursor-pointer list-none flex items-center justify-between py-3 border-t border-[#E5EBF7] select-none">
          <span className="text-sm font-semibold text-[#5D79C7] group-open:text-[#3478F6] transition-colors">
            Additional details <span className="font-normal text-[#8BA3D4]">(optional)</span>
          </span>
          <ChevronRight size={16} className="text-[#5D79C7] group-open:rotate-90 transition-transform" />
        </summary>

        <div className="space-y-5 pt-4">
          {/* Property type */}
          <div>
            <p className="text-sm font-semibold text-[#142039] mb-2">Property type</p>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('propertyType', form.propertyType === t ? '' : t)}
                  className={`text-sm px-4 py-2 rounded-lg border font-medium transition-all ${
                    form.propertyType === t
                      ? 'border-[#3478F6] bg-[#F4F7FF] text-[#3478F6]'
                      : 'border-[#E5EBF7] text-[#5D79C7] hover:border-[#3478F6]/40'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Affected area */}
          <div>
            <label className="block text-sm font-semibold text-[#142039] mb-1.5">
              Approximate affected area
            </label>
            <input
              type="text"
              value={form.affectedArea}
              onChange={(e) => set('affectedArea', e.target.value)}
              placeholder="e.g. 30 cm patch, 2 m crack, whole wall…"
              className="w-full border border-[#E5EBF7] bg-[#F4F7FF] focus:bg-white rounded-xl px-4 py-2.5 text-sm text-[#142039] placeholder-[#8BA3D4] focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
            />
          </div>

          {/* After rain or plumbing */}
          <div>
            <p className="text-sm font-semibold text-[#142039] mb-2">
              Does the issue appear or worsen after rain or plumbing use?
            </p>
            <RadioGroup
              name="afterRainOrPlumbing"
              options={['After rain', 'After plumbing use', 'Both', 'Neither', 'Not sure']}
              value={form.afterRainOrPlumbing}
              onChange={(v) => set('afterRainOrPlumbing', v)}
              cols={2}
            />
          </div>
        </div>
      </details>
    </div>
  )
}

function Step5Safety({
  form,
  setForm,
  errors,
}: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  errors: Record<string, string>
}) {
  const set = (key: keyof FormState, val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  const safetyItems: {
    key: keyof FormState
    icon: React.FC<{ size?: number; className?: string }>
    label: string
    description: string
    dangerous?: boolean
  }[] = [
    {
      key: 'gasSmell',
      icon: Flame,
      label: 'Strong smell of gas',
      description: 'An unusual or strong smell of gas anywhere in or near the property.',
      dangerous: true,
    },
    {
      key: 'waterNearElectrics',
      icon: Zap,
      label: 'Water near electrical outlets or equipment',
      description: 'Visible water, damp, or flooding close to plug sockets, fuse boxes, or wiring.',
      dangerous: true,
    },
    {
      key: 'unstableStructure',
      icon: ShieldAlert,
      label: 'Visibly unstable ceiling or wall',
      description: 'A ceiling or wall that appears to be sagging, bulging, or at risk of collapse.',
      dangerous: true,
    },
    {
      key: 'rapidLeak',
      icon: CloudRain,
      label: 'Major or rapidly worsening leak',
      description: 'A large volume of water actively flowing or accumulating quickly.',
      dangerous: true,
    },
    {
      key: 'wideningCrack',
      icon: ScanLine,
      label: 'Large or rapidly widening structural crack',
      description: 'A crack that is visibly growing quickly or is more than 5 mm wide and diagonal.',
      dangerous: false,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-[#F5A623]/10 border border-[#F5A623]/25 rounded-xl p-4 flex gap-3">
        <AlertTriangle size={18} className="text-[#F5A623] shrink-0 mt-0.5" />
        <p className="text-sm text-[#142039] leading-relaxed">
          Before we continue, please answer these questions honestly. They help us identify
          whether any immediate action is needed for your safety.
        </p>
      </div>

      {safetyItems.map(({ key, icon: Icon, label, description }) => {
        const val = form[key] as string
        return (
          <div
            key={key}
            className={`rounded-2xl border p-5 transition-all ${
              val === 'Yes'
                ? 'border-red-300 bg-red-50'
                : 'border-[#E5EBF7] bg-white'
            }`}
          >
            <div className="flex gap-3 mb-4">
              <div
                className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center ${
                  val === 'Yes' ? 'bg-red-100' : 'bg-[#F4F7FF]'
                }`}
              >
                <Icon size={17} className={val === 'Yes' ? 'text-red-500' : 'text-[#3478F6]'} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#142039]">{label}</p>
                <p className="text-xs text-[#5D79C7] mt-0.5 leading-relaxed">{description}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['Yes', 'No', 'Not sure'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set(key, opt)}
                  className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6] ${
                    val === opt
                      ? opt === 'Yes'
                        ? 'border-red-400 bg-red-100 text-red-700'
                        : opt === 'No'
                        ? 'border-[#16C784] bg-[#16C784]/10 text-[#0fa868]'
                        : 'border-[#3478F6] bg-[#F4F7FF] text-[#3478F6]'
                      : 'border-[#E5EBF7] text-[#5D79C7] hover:border-[#3478F6]/40 hover:bg-[#F4F7FF]/60'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {errors.safety && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-2" role="alert">
          <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{errors.safety}</p>
        </div>
      )}
    </div>
  )
}

// ─── Emergency screen ─────────────────────────────────────────────────────────

function EmergencyScreen({
  type,
  onBack,
  onProfessionalHelp,
}: {
  type: EmergencyType
  onBack: () => void
  onProfessionalHelp: () => void
}) {
  const configs: Record<
    NonNullable<EmergencyType>,
    {
      icon: React.FC<{ size?: number; className?: string }>
      heading: string
      intro: string
      actions: { text: string; important?: boolean }[]
      cta?: { label: string; href?: string }
      note: string
    }
  > = {
    gas: {
      icon: Flame,
      heading: 'Suspected Gas Leak — Act Now',
      intro:
        'If you can smell gas, this is a potential emergency. Do not use any electrical switches, open flames, or electronic devices inside the property.',
      actions: [
        { text: 'Leave the affected area immediately and move to fresh air.', important: true },
        { text: 'Do not turn any electrical switches on or off.' },
        { text: 'Do not use your phone inside the property — move outside first.' },
        { text: 'Leave doors open as you leave if it is safe to do so.' },
        { text: 'From outside or a safe location, call the National Gas Emergency Service.', important: true },
      ],
      cta: { label: '0800 111 999 — National Gas Emergency', href: 'tel:08001119999' },
      note: 'Do not re-enter the property until it has been checked by a Gas Safe-registered engineer.',
    },
    electrics: {
      icon: Zap,
      heading: 'Water Near Electrical Equipment — Immediate Risk',
      intro:
        'Water and electricity together create a serious risk of electric shock. Do not touch any electrical outlets, switches, or equipment in the affected area.',
      actions: [
        { text: 'Do not touch any switches, outlets, or electrical equipment in the affected area.', important: true },
        { text: 'If it is safe to do so, turn off the electricity at the consumer unit (fuse box) — but only if you can reach it without entering the affected area.' },
        { text: 'If you are uncertain, do not attempt to isolate the supply yourself.' },
        { text: 'Keep people and pets away from the affected area.' },
        { text: 'Call a Part P-certified electrician or, if there is an immediate risk to life, call 999.', important: true },
      ],
      cta: { label: 'Call 999 if there is immediate risk to life', href: 'tel:999' },
      note: 'The area must not be used until inspected and cleared by a qualified electrician.',
    },
    structure: {
      icon: ShieldAlert,
      heading: 'Potentially Unstable Structure',
      intro:
        'A visibly sagging, bulging, or cracking ceiling or wall could indicate a structural risk. Do not stand beneath it or lean on it.',
      actions: [
        { text: 'Move people and pets away from the area immediately.', important: true },
        { text: 'Do not attempt to prop up, touch, or inspect the structure yourself.' },
        { text: 'Do not re-enter the room until a professional has assessed it.' },
        { text: 'Contact a structural engineer or RICS-qualified surveyor for an urgent assessment.', important: true },
        { text: 'If you believe imminent collapse is likely, call 999.' },
      ],
      cta: { label: 'Call 999 if collapse is imminent', href: 'tel:999' },
      note: 'Only a qualified structural engineer can determine whether the structure is safe.',
    },
    leak: {
      icon: CloudRain,
      heading: 'Major or Rapidly Worsening Leak',
      intro:
        'A major leak can cause significant damage quickly and may create secondary risks including structural damage and electrical hazards.',
      actions: [
        { text: 'Locate and shut off the water supply at the stopcock immediately.', important: true },
        { text: 'If water is near any electrical equipment, do not enter that area — isolate the electricity supply first if safe to do so.' },
        { text: 'Place towels or buckets to limit spread, but only if it is safe to do so.' },
        { text: 'Document the damage with photographs.' },
        { text: 'Call a licensed plumber for urgent assistance.', important: true },
      ],
      note: 'If you are a tenant, notify your landlord or property manager immediately and in writing.',
    },
  }

  const config = configs[type!]
  const Icon = config.icon

  return (
    <div className="min-h-screen bg-[#F4F7FF] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-red-200 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-8 text-white">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
              <Icon size={28} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">{config.heading}</h1>
            <p className="text-red-100 leading-relaxed text-base">{config.intro}</p>
          </div>

          {/* Actions */}
          <div className="p-8 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#5D79C7] mb-4">
              What to do now
            </h2>
            <ol className="space-y-3">
              {config.actions.map((action, i) => (
                <li key={i} className={`flex gap-3 p-3.5 rounded-xl ${action.important ? 'bg-red-50 border border-red-200' : 'bg-[#F4F7FF]'}`}>
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                      action.important ? 'bg-red-500 text-white' : 'bg-[#E5EBF7] text-[#5D79C7]'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <p className={`text-sm leading-relaxed ${action.important ? 'text-red-700 font-semibold' : 'text-[#1D2A49]'}`}>
                    {action.text}
                  </p>
                </li>
              ))}
            </ol>

            {config.cta && (
              <a
                href={config.cta.href}
                className="flex items-center justify-center gap-2.5 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Phone size={18} />
                {config.cta.label}
              </a>
            )}

            <div className="bg-[#F4F7FF] border border-[#E5EBF7] rounded-xl p-4 mt-2">
              <p className="text-xs text-[#5D79C7] leading-relaxed">
                <strong className="text-[#142039]">Note: </strong>{config.note}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5EBF7]">
              <Button variant="secondary" onClick={onBack} className="flex-1">
                <ChevronLeft size={16} className="mr-1" /> Back to Form
              </Button>
              <Button onClick={onProfessionalHelp} className="flex-1">
                Request Professional Help <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const STEP_TITLES = [
  { title: 'Select the Issue', subtitle: 'What type of problem have you noticed?' },
  { title: 'Upload a Photo', subtitle: 'A photo can help narrow down possible causes.' },
  { title: 'Describe the Issue', subtitle: 'Tell us what you have noticed in your own words.' },
  { title: 'A Bit More Context', subtitle: 'A few questions to help us understand the situation better.' },
  { title: 'Safety Check', subtitle: 'Please answer these questions before we continue.' },
]

export default function Analyze() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)

  const sampleParam = searchParams.get('sample')
  const initialSample = sampleParam ? SAMPLE_ISSUES.find((s) => s.id === sampleParam) : null

  const [activeSampleNotice, setActiveSampleNotice] = useState<string | null>(() => {
    return initialSample ? `Loaded demo sample: "${initialSample.title}". All form steps are prefilled.` : null
  })

  const [form, setForm] = useState<FormState>(() => {
    if (initialSample) {
      return {
        issueCategory: initialSample.category,
        imagePreview: null,
        imageName: null,
        description: initialSample.description,
        location: initialSample.location,
        locationOther: '',
        firstNoticed: initialSample.firstNoticed,
        gettingWorse: initialSample.gettingWorse,
        happenedBefore: initialSample.happenedBefore,
        propertyType: initialSample.propertyType,
        affectedArea: initialSample.affectedArea,
        afterRainOrPlumbing: initialSample.afterRainOrPlumbing,
        wideningCrack: initialSample.wideningCrack,
        waterNearElectrics: initialSample.waterNearElectrics,
        unstableStructure: initialSample.unstableStructure,
        rapidLeak: initialSample.rapidLeak,
        gasSmell: initialSample.gasSmell,
      }
    }
    try {
      const saved = sessionStorage.getItem('propsight_analyze_draft')
      return saved ? { ...INITIAL_FORM, ...JSON.parse(saved) } : INITIAL_FORM
    } catch {
      return INITIAL_FORM
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [emergency, setEmergency] = useState<EmergencyType>(null)

  const applySample = useCallback((sample: SampleIssue) => {
    const updated: FormState = {
      issueCategory: sample.category,
      imagePreview: null,
      imageName: null,
      description: sample.description,
      location: sample.location,
      locationOther: '',
      firstNoticed: sample.firstNoticed,
      gettingWorse: sample.gettingWorse,
      happenedBefore: sample.happenedBefore,
      propertyType: sample.propertyType,
      affectedArea: sample.affectedArea,
      afterRainOrPlumbing: sample.afterRainOrPlumbing,
      wideningCrack: sample.wideningCrack,
      waterNearElectrics: sample.waterNearElectrics,
      unstableStructure: sample.unstableStructure,
      rapidLeak: sample.rapidLeak,
      gasSmell: sample.gasSmell,
    }
    setForm(updated)
    setErrors({})
    setActiveSampleNotice(`Loaded demo sample: "${sample.title}". All form steps are prefilled.`)
  }, [])

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM)
    setErrors({})
    setStep(1)
    setActiveSampleNotice(null)
    sessionStorage.removeItem('propsight_analyze_draft')
    sessionStorage.removeItem('propsight_submission')
  }, [])

  // Autosave draft (excluding image due to size — store flag only)
  useEffect(() => {
    const draft = { ...form, imagePreview: form.imagePreview ? '__HAS_IMAGE__' : null }
    sessionStorage.setItem('propsight_analyze_draft', JSON.stringify(draft))
  }, [form])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const validateStep = (s: number): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (s === 1 && !form.issueCategory) {
      errs.issueCategory = 'Please select an issue type to continue.'
    }
    if (s === 3 && form.description.trim().length < 20) {
      errs.description = 'Please describe the issue in at least 20 characters so we can understand what is happening.'
    }
    if (s === 4) {
      if (!form.location) errs.location = 'Please tell us where in the property the issue is located.'
      if (!form.firstNoticed) errs.firstNoticed = 'Please select approximately when you first noticed it.'
    }
    if (s === 5) {
      const unanswered = ['gasSmell', 'waterNearElectrics', 'unstableStructure', 'rapidLeak', 'wideningCrack'].filter(
        (k) => !form[k as keyof FormState]
      )
      if (unanswered.length > 0) {
        errs.safety = 'Please answer all safety questions to confirm safe next steps.'
      }
    }
    return errs
  }

  const goNext = () => {
    const errs = validateStep(step)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
    scrollToTop()
  }

  const goBack = () => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
    scrollToTop()
  }

  const handleSubmit = async () => {
    const errs = validateStep(5)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    // Safety screening check
    const emType = detectEmergency(form)
    if (emType) {
      setEmergency(emType)
      scrollToTop()
      return
    }

    setLoading(true)

    // Persist to sessionStorage for Results page
    const submission = {
      issueCategory: form.issueCategory,
      description: form.description,
      location: form.location === 'Other' ? form.locationOther || 'Other' : form.location,
      firstNoticed: form.firstNoticed,
      gettingWorse: form.gettingWorse,
      happenedBefore: form.happenedBefore,
      propertyType: form.propertyType,
      affectedArea: form.affectedArea,
      afterRainOrPlumbing: form.afterRainOrPlumbing,
      wideningCrack: form.wideningCrack,
      hasImage: !!form.imagePreview,
      imagePreview: form.imagePreview,
      category: form.issueCategory,
      urgency: form.gettingWorse === 'Yes' ? 'high' : form.firstNoticed === 'Today' ? 'medium' : 'low',
      timestamp: new Date().toISOString(),
    }
    sessionStorage.setItem('propsight_submission', JSON.stringify(submission))

    await new Promise((r) => setTimeout(r, 1400))
    setLoading(false)
    sessionStorage.removeItem('propsight_analyze_draft')
    navigate('/results')
  }

  // Show emergency screen if hazard detected
  if (emergency) {
    return (
      <EmergencyScreen
        type={emergency}
        onBack={() => { setEmergency(null); scrollToTop() }}
        onProfessionalHelp={() => navigate('/professional-help')}
      />
    )
  }

  const currentMeta = STEP_TITLES[step - 1]

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#3478F6 1px,transparent 1px),linear-gradient(90deg,#3478F6 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5EBF7] text-[#3478F6] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-xs">
            <CheckCircle2 size={11} />
            Property Analysis
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#142039] leading-tight mb-2">
            Let's Understand Your{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg,#3478F6 0%,#4F8DFF 100%)' }}
            >
              Property Issue
            </span>
          </h1>
          <p className="text-[#5D79C7] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Tell us what you have noticed. A photo and a few details can help us suggest the right next step.
          </p>
        </div>

        {/* ─── DEMONSTRATION MODE / SAMPLE PICKER ─── */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E5EBF7] shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#142039]">
              <Sparkles size={15} className="text-[#3478F6]" />
              <span>Try a Sample Issue (Demonstration Mode)</span>
            </div>
            {form.issueCategory && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-[#5D79C7] hover:text-[#3478F6] flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw size={12} /> Reset Form
              </button>
            )}
          </div>

          <p className="text-xs text-[#5D79C7] mb-3">
            Select a predefined scenario to populate realistic example data for testing:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_ISSUES.slice(0, 3).map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => applySample(sample)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  form.issueCategory === sample.category
                    ? 'border-[#3478F6] bg-[#F4F7FF] text-[#142039] font-bold shadow-xs'
                    : 'border-[#E5EBF7] bg-white text-[#1D2A49] hover:border-[#3478F6]/50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold truncate">{sample.title}</span>
                </div>
                <span className="text-[10px] text-[#5D79C7] block truncate">
                  {sample.category}
                </span>
              </button>
            ))}
          </div>

          {activeSampleNotice && (
            <div className="mt-3 p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-[#142039] flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#16C784] shrink-0" />
                {activeSampleNotice}
              </span>
              <button
                type="button"
                onClick={() => {
                  setStep(5)
                }}
                className="font-bold text-[#3478F6] hover:underline shrink-0"
              >
                Jump to Submit &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <ProgressBar current={step} />

        {/* Step card */}
        <Card className="mb-6">
          {/* Step header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E5EBF7]">
            <div className="w-8 h-8 bg-[#3478F6] rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0">
              {step}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#142039]">{currentMeta.title}</h2>
              <p className="text-xs text-[#5D79C7]">{currentMeta.subtitle}</p>
            </div>
          </div>

          {/* Step content */}
          {step === 1 && (
            <Step1Category form={form} setForm={setForm} errors={errors} />
          )}
          {step === 2 && (
            <Step2Photo form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
          )}
          {step === 3 && (
            <Step3Description form={form} setForm={setForm} errors={errors} />
          )}
          {step === 4 && (
            <Step4Context form={form} setForm={setForm} errors={errors} />
          )}
          {step === 5 && (
            <Step5Safety form={form} setForm={setForm} errors={errors} />
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {step > 1 && (
            <Button variant="secondary" size="lg" onClick={goBack} className="flex items-center gap-2">
              <ChevronLeft size={18} /> Back
            </Button>
          )}

          {step < TOTAL_STEPS ? (
            <Button size="lg" onClick={goNext} className="flex-1 flex items-center justify-center gap-2">
              Continue <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              size="lg"
              disabled={loading}
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analysing your issue…
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} /> Analyze My Issue
                </>
              )}
            </Button>
          )}
        </div>

        {/* Step counter */}
        <p className="text-center text-xs text-[#8BA3D4] mt-4">
          Step {step} of {TOTAL_STEPS} &nbsp;·&nbsp; Your data stays on your device
          {step < TOTAL_STEPS && (
            <>
              {' '}&nbsp;·&nbsp;{' '}
              <button
                type="button"
                onClick={() => setStep(TOTAL_STEPS)}
                className="underline hover:text-[#3478F6] transition-colors"
              >
                Skip to safety check
              </button>
            </>
          )}
        </p>

        <p className="text-center text-xs text-[#8BA3D4] mt-2">
          Prototype demonstration: this assessment uses simulated logic and is not a professional inspection.
        </p>
      </div>
    </div>
  )
}
