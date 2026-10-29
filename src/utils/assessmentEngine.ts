// Modular Assessment Engine for PropSight AI
// Transparent, rule-based simulated AI output designed for hackathon prototype
// Can be replaced or enhanced with a multimodal vision-language model API in future

export interface UserSubmission {
  issueCategory: string
  description: string
  location?: string
  firstNoticed?: string
  gettingWorse?: string
  happenedBefore?: string
  propertyType?: string
  affectedArea?: string
  afterRainOrPlumbing?: string
  wideningCrack?: string
  hasImage?: boolean
  imagePreview?: string | null
  category?: string
  urgency?: string
  timestamp?: string
}

export type PriorityLevel = 'LOW' | 'MODERATE' | 'HIGH'

export interface TroubleshootingStep {
  stepNumber: number
  instruction: string
  whyItMatters: string
}

export interface AssessmentResult {
  reportedIssue: string
  priority: PriorityLevel
  priorityTitle: string
  priorityDescription: string
  visibleSymptoms: string[]
  userReportedSymptoms: string[]
  possibleExplanations: string[]
  missingInformation: string[]
  recommendedNextStep: string
  troubleshootingSteps: TroubleshootingStep[]
  isEscalationRecommended: boolean
  escalationReason?: string
  cautionaryNotes: string[]
}

export function evaluateAssessment(submission: UserSubmission): AssessmentResult {
  const category = submission.issueCategory || submission.category || 'Other'
  const gettingWorse = submission.gettingWorse === 'Yes'
  const hasWideningCrack = submission.wideningCrack === 'Yes'
  const afterRainOrPlumb = submission.afterRainOrPlumbing

  // Determine Priority Level strictly
  let priority: PriorityLevel = 'LOW'
  let priorityTitle = 'Low Priority — Routine Observation'
  let priorityDescription =
    'No immediate warning signs have been reported. Basic observation or safe troubleshooting may be appropriate.'

  const highCategories = [
    'Wall or Ceiling Cracks',
    'Water Leakage',
    'Roof or Ceiling Damage',
    'Plumbing & Leaks',
    'Electrical',
    'Heating & Boiler',
    'Structural / Cracks',
  ]

  const moderateCategories = [
    'Damp or Moisture',
    'Damp & Moisture',
    'Roof & Guttering',
    'Pest Infestation',
  ]

  if (hasWideningCrack || (gettingWorse && highCategories.includes(category)) || category === 'Water Leakage' || category === 'Wall or Ceiling Cracks') {
    priority = 'HIGH'
    priorityTitle = 'High Priority — Prompt Professional Inspection Advised'
    priorityDescription =
      'The reported symptoms may indicate an active or potentially serious issue. Avoid risky DIY repairs and seek appropriate professional assessment.'
  } else if (gettingWorse || moderateCategories.includes(category) || (afterRainOrPlumb && afterRainOrPlumb !== 'Neither')) {
    priority = 'MODERATE'
    priorityTitle = 'Moderate Priority — Closer Inspection Required'
    priorityDescription =
      'The issue may need closer inspection or prompt attention, especially if it persists, spreads, or worsens over time.'
  } else {
    priority = 'LOW'
    priorityTitle = 'Low Priority — Safe Observation & Basic Troubleshooting'
    priorityDescription =
      'No immediate warning signs have been reported. Basic observation or safe troubleshooting may be appropriate.'
  }

  // Synthesize user-reported symptoms
  const userReported: string[] = []
  if (submission.description) {
    userReported.push(`User observed: "${submission.description.slice(0, 160)}${submission.description.length > 160 ? '...' : ''}"`)
  }
  if (submission.location) {
    userReported.push(`Location identified in property: ${submission.location}`)
  }
  if (submission.firstNoticed) {
    userReported.push(`First noticed: ${submission.firstNoticed.toLowerCase()}`)
  }
  if (submission.gettingWorse) {
    userReported.push(`Progression: Reported as ${submission.gettingWorse.toLowerCase()} getting worse`)
  }
  if (submission.afterRainOrPlumbing && submission.afterRainOrPlumbing !== 'Not sure') {
    userReported.push(`Environmental trigger: Correlated with ${submission.afterRainOrPlumbing.toLowerCase()}`)
  }
  if (submission.affectedArea) {
    userReported.push(`Reported extent: Approximately ${submission.affectedArea}`)
  }

  // Simulated image findings (clearly distinguished)
  const visibleSymptoms: string[] = []
  if (submission.hasImage && submission.imagePreview) {
    visibleSymptoms.push(
      `Photo submitted (${category.toLowerCase()}) — visual features consistent with localized surface discolouration and texture irregularity.`
    )
    visibleSymptoms.push(
      'Boundary assessment: Perimeter appears variable; requires physical moisture probe or level gauge to assess depth.'
    )
  } else {
    visibleSymptoms.push('No photo provided — assessment is derived solely from user-reported responses.')
  }

  // Category specific data
  let possibleExplanations: string[] = []
  let missingInformation: string[] = []
  let recommendedNextStep = ''
  let troubleshootingSteps: TroubleshootingStep[] = []
  let isEscalationRecommended = false
  let escalationReason: string | undefined

  switch (category) {
    case 'Damp or Moisture':
    case 'Damp & Moisture':
      possibleExplanations = [
        'Possible explanation: Penetrating damp through external render, mortar joint failure, or damaged rainwater goods.',
        'Possible explanation: Surface condensation forming on colder thermal bridges during temperature drops.',
        'Possible explanation: Potential breach in damp-proof course (DPC) if located near ground level.',
      ]
      missingInformation = [
        'External wall condition directly opposite the affected interior area.',
        'Relative indoor humidity and room temperature measurements.',
        'Moisture meter readings beneath surface plaster.',
      ]
      recommendedNextStep =
        'Check external rainwater downpipes and guttering from ground level during rainfall to spot overflows.'
      troubleshootingSteps = [
        {
          stepNumber: 1,
          instruction: 'Observe whether the area becomes noticeably wetter after rain or after nearby plumbing use.',
          whyItMatters:
            'Distinguishing rain-dependent moisture from plumbing leaks narrows down whether external envelope or internal pipework is responsible.',
        },
        {
          stepNumber: 2,
          instruction: 'Record the exact location and approximate dimensions of the damp patch with a tape measure.',
          whyItMatters:
            'Tracking dimensions over a 7-day period demonstrates whether the defect is active, spreading, or drying out.',
        },
        {
          stepNumber: 3,
          instruction: 'If safe to do so, photograph the patch under uniform daytime lighting from the same angle.',
          whyItMatters:
            'Consistent photographic logs provide objective comparative evidence for visiting surveyors or landlords.',
        },
        {
          stepNumber: 4,
          instruction: 'Check for obvious surface condensation on window glass or cold mirrors in the same room without disturbing damaged materials.',
          whyItMatters:
            'Condensation indicates elevated indoor humidity rather than external masonry penetration.',
        },
        {
          stepNumber: 5,
          instruction: 'If the patch continues spreading, recurs after rain, or is accompanied by a persistent drip, arrange an in-person damp survey.',
          whyItMatters:
            'Chronic moisture degrades structural plaster and timber joists if left unrectified.',
        },
      ]
      if (gettingWorse || priority === 'HIGH') {
        isEscalationRecommended = true
        escalationReason = 'Spreading damp or persistent moisture ingress requires physical inspection to protect structural timbers.'
      }
      break

    case 'Mould-Like Growth':
    case 'Mould & Condensation':
      possibleExplanations = [
        'Possible explanation: Surface mould (such as Cladosporium or Aspergillus) flourishing in stagnant, humid air on cold thermal bridges.',
        'Possible explanation: Secondary moisture symptom following water ingress or poor window reveal insulation.',
      ]
      missingInformation = [
        'Extent of growth behind heavy furniture, skirting boards, or inside cupboards.',
        'Operational status and airflow rate of mechanical extractor fans.',
      ]
      recommendedNextStep =
        'Improve passive ventilation and avoid disturbing dry spore clusters without personal protective equipment.'
      troubleshootingSteps = [
        {
          stepNumber: 1,
          instruction: 'Avoid disturbing or dry-brushing the affected material.',
          whyItMatters:
            'Dry-brushing releases spores into the indoor air, which can cause respiratory irritation or cross-contaminate other rooms.',
        },
        {
          stepNumber: 2,
          instruction: 'Do not assume that ventilation alone will resolve the underlying cause.',
          whyItMatters:
            'While airflow helps surface condensation, cold bridging or exterior water ingress may keep the substrate continuously damp.',
        },
        {
          stepNumber: 3,
          instruction: 'Note the approximate affected area (in square metres) and whether the underlying surface feels damp to the touch.',
          whyItMatters:
            'Mould covering greater than 1 square metre or recurring continuously is classified by UK housing standards as requiring landlord or specialist intervention.',
        },
        {
          stepNumber: 4,
          instruction: 'Seek professional advice for extensive, recurring, or hidden growth, or when the underlying moisture cause remains unclear.',
          whyItMatters:
            'A qualified damp specialist or environmental surveyor can identify whether building defects require remediation.',
        },
      ]
      if (gettingWorse || priority === 'HIGH') {
        isEscalationRecommended = true
        escalationReason = 'Extensive or worsening mould growth requires professional remediation and air quality assessment.'
      }
      break

    case 'Peeling Paint':
      possibleExplanations = [
        'Possible explanation: Substrate moisture causing loss of adhesion between paint coating and plaster.',
        'Possible explanation: Incompatible paint formulation or inadequate primer application during past redecoration.',
        'Possible explanation: Thermal expansion and contraction over hairline settling joints.',
      ]
      missingInformation = [
        'Approximate construction era of the property (to gauge lead paint potential).',
        'Moisture level behind peeling flakes.',
      ]
      recommendedNextStep =
        'Record the affected location and determine whether moisture or dampness is present beneath the flaking paint.'
      troubleshootingSteps = [
        {
          stepNumber: 1,
          instruction: 'Record the affected location and inspect surrounding walls for companion signs like bubbling or staining.',
          whyItMatters:
            'Peeling localized to baseboards or ceilings often correlates with moisture entry points rather than ordinary wear.',
        },
        {
          stepNumber: 2,
          instruction: 'Look for visible signs of moisture without touching damaged electrical fixtures or sockets.',
          whyItMatters:
            'Moisture behind paint near wiring or switches presents an electric shock hazard.',
        },
        {
          stepNumber: 3,
          instruction: 'Do not scrape paint when the building’s age or unknown paint composition makes lead exposure a concern.',
          whyItMatters:
            'Pre-1970s UK properties frequently contain lead primers. Scraping or power sanding creates toxic dust.',
        },
        {
          stepNumber: 4,
          instruction: 'If peeling recurs or the substrate remains persistently damp or powdery, arrange a professional assessment.',
          whyItMatters:
            'Repainting over damp or degraded plaster will simply peel again within weeks.',
        },
      ]
      break

    case 'Water Leakage':
    case 'Plumbing & Leaks':
      possibleExplanations = [
        'Possible explanation: Pressurised water supply pipe pinhole leak or failing waste pipe coupling.',
        'Possible explanation: Failed silicone perimeter seal or grouting around shower tray/bathtub.',
        'Possible explanation: Overflow pipe discharge from header tank or boiler expansion vessel.',
      ]
      missingInformation = [
        'Proximity to electrical consumer units, sockets, or lighting pendants.',
        'Whether water meter dial spins while all internal taps are closed.',
      ]
      recommendedNextStep =
        'Verify immediate electrical safety, isolate water if accessible, and request a qualified plumber.'
      troubleshootingSteps = [
        {
          stepNumber: 1,
          instruction: 'If water is anywhere near electrical equipment or light fittings, do not touch the equipment or enter standing water.',
          whyItMatters:
            'Water conducts electricity from concealed cables, presenting a life-threatening shock hazard.',
        },
        {
          stepNumber: 2,
          instruction: 'If safe and the water source is obvious, follow your property’s internal stopcock shutoff procedure.',
          whyItMatters:
            'Isolating the internal mains stops pressurised supply leaks immediately and halts escalating ceiling damage.',
        },
        {
          stepNumber: 3,
          instruction: 'If the water cannot be controlled or the leak is substantial, seek urgent professional help immediately.',
          whyItMatters:
            'Uncontrolled water ingress rapidly saturates plasterboard ceilings, risking sudden collapse under weight.',
        },
        {
          stepNumber: 4,
          instruction: 'Photograph the affected area only when safe and maintain a bucket/towel containment barrier.',
          whyItMatters:
            'Insurance claims and emergency plumbers require clear evidence of the leak source and immediate containment efforts.',
        },
      ]
      isEscalationRecommended = true
      escalationReason = 'Active leaks carry severe risks of structural ceiling failure and electrical shorting.'
      break

    case 'Wall or Ceiling Cracks':
    case 'Structural / Cracks':
      possibleExplanations = [
        'Possible explanation: Normal seasonal thermal movement or plaster shrinkage between dissimilar materials.',
        'Possible explanation: Differential foundation settlement or subsoil moisture fluctuations.',
        'Possible explanation: Structural timber joist deflection or inadequate lintel bearing over openings.',
      ]
      missingInformation = [
        'Crack trajectory (stair-step in brickwork, diagonal, or vertical).',
        'Whether adjoining doors or windows are sticking in their frames.',
      ]
      recommendedNextStep =
        'Measure crack width using a millimeter gauge or coin reference and monitor for ongoing progression.'
      troubleshootingSteps = [
        {
          stepNumber: 1,
          instruction: 'Record the crack’s location and approximate width without damaging or scraping the surrounding surface.',
          whyItMatters:
            'Hairline cracks (<1mm) are commonly cosmetic plaster settlement, while cracks >5mm or diagonal cracks require structural evaluation.',
        },
        {
          stepNumber: 2,
          instruction: 'Take a clear photograph from a safe position, placing a ruler or standard coin alongside for scale.',
          whyItMatters:
            'Having an exact visual scale enables structural engineers to assess classification without guessing dimensions.',
        },
        {
          stepNumber: 3,
          instruction: 'Compare with previous photographs if available, and mark the crack extremities lightly with a soft pencil and date.',
          whyItMatters:
            'If the crack tip extends beyond the pencil line over the coming weeks, active structural movement is confirmed.',
        },
        {
          stepNumber: 4,
          instruction: 'If the crack is rapidly widening, accompanied by noticeable floor slope or sticking doors, stop DIY troubleshooting and arrange a RICS structural survey.',
          whyItMatters:
            'Active structural movement cannot be resolved with filler and requires professional foundation assessment.',
        },
      ]
      if (hasWideningCrack || gettingWorse || priority === 'HIGH') {
        isEscalationRecommended = true
        escalationReason = 'Widening structural cracks or potential movement require formal inspection by a RICS surveyor or structural engineer.'
      }
      break

    case 'Roof or Ceiling Damage':
    case 'Roof & Guttering':
      possibleExplanations = [
        'Possible explanation: Dislodged, slipped, or fractured slate/tile exposing underlayment.',
        'Possible explanation: Blocked or disconnected box guttering overflowing into roof eaves.',
        'Possible explanation: Flashing failure around chimney stack or parapet wall.',
      ]
      missingInformation = [
        'Safe internal access to roof space/loft to inspect rafters and insulation.',
        'Condition of external valleys and downpipes.',
      ]
      recommendedNextStep =
        'Inspect safely from ground level with binoculars; never climb onto an untested roof covering.'
      troubleshootingSteps = [
        {
          stepNumber: 1,
          instruction: 'Do not access the roof yourself. Working at height without fall-arrest equipment is hazardous.',
          whyItMatters:
            'Roof work accounts for major domestic accident injuries; damp slates are slippery and fragile.',
        },
        {
          stepNumber: 2,
          instruction: 'Inspect gutters, valleys, and downpipes from ground level using binoculars or mobile zoom.',
          whyItMatters:
            'Overspilling leaf debris or detached brackets can be spotted safely without ascending a ladder.',
        },
        {
          stepNumber: 3,
          instruction: 'If you have safe loft access, check for daylight penetration or wet insulation directly under the roof rafters.',
          whyItMatters:
            'Locating the entry point in the attic pinpoints where the tile or lead flashing has failed.',
        },
        {
          stepNumber: 4,
          instruction: 'Place a receptacle under any internal ceiling drip and contact a vetted roofing contractor.',
          whyItMatters:
            'Preventing water pool buildup protects plasterboard ceilings from bowing or dropping.',
        },
      ]
      isEscalationRecommended = true
      escalationReason = 'Roof access and work at height requires a qualified and insured roofing contractor.'
      break

    case 'Damaged Flooring':
      possibleExplanations = [
        'Possible explanation: Concealed pipe leak or rising moisture from uninsulated concrete slab causing timber expansion.',
        'Possible explanation: Subfloor joist deflection or lack of noggins beneath floorboards.',
        'Possible explanation: Adhesive degradation or damp underlayment under laminate/vinyl.',
      ]
      missingInformation = [
        'Whether floor is solid concrete or suspended timber.',
        'Presence of musty odours beneath floor coverings.',
      ]
      recommendedNextStep =
        'Examine floor perimeter for sponginess or damp staining without forcing loose boards.'
      troubleshootingSteps = [
        {
          stepNumber: 1,
          instruction: 'Walk gently around the affected zone to identify whether it feels springy, soft, or noticeably uneven.',
          whyItMatters:
            'Softness in timber flooring often points to wet rot or subfloor fungal decay.',
        },
        {
          stepNumber: 2,
          instruction: 'Check nearby radiators, pipe boxes, and appliances (dishwasher, washing machine) for slow weepage.',
          whyItMatters:
            'Subfloor timber damage is frequently caused by slow unnoticed appliance connector drips.',
        },
        {
          stepNumber: 3,
          instruction: 'Do not pull up anchored floorboards or tiles without checking for concealed underfloor heating or wiring.',
          whyItMatters:
            'Prying up boards blindly can puncture heating pipes or sever electrical cables.',
        },
        {
          stepNumber: 4,
          instruction: 'If significant bounce, decay, or damp odor is evident, consult a flooring contractor or carpenter.',
          whyItMatters:
            'Compromised floor joists undermine structural load capacity and need professional repair.',
        },
      ]
      break

    default:
      possibleExplanations = [
        'Possible explanation: Property maintenance symptom requiring focused on-site diagnostic inspection.',
        'Possible explanation: Multiple contributing factors such as age of building components and ambient moisture.',
      ]
      missingInformation = [
        'Specific structural or mechanical system involved.',
        'Maintenance history of the affected area.',
      ]
      recommendedNextStep =
        'Document symptom progression with photos and arrange a general trade inspection if issues continue.'
      troubleshootingSteps = [
        {
          stepNumber: 1,
          instruction: 'Document the issue with clear photographs and write down when it is most prominent.',
          whyItMatters:
            'Clear records help trade professionals identify patterns and intermittent faults.',
        },
        {
          stepNumber: 2,
          instruction: 'Check whether the issue is affected by weather changes, heating use, or water consumption.',
          whyItMatters:
            'Correlations help distinguish plumbing, roofing, and thermal defects.',
        },
        {
          stepNumber: 3,
          instruction: 'Ensure the area remains well-ventilated, dry, and clean while monitoring for 48 hours.',
          whyItMatters:
            'Basic environmental stability helps clarify whether symptoms are temporary.',
        },
        {
          stepNumber: 4,
          instruction: 'If the problem persists or worsens, prepare a service request for a qualified professional.',
          whyItMatters:
            'Unresolved property defects often become more costly and invasive to remediate over time.',
        },
      ]
      break
  }

  const cautionaryNotes = [
    'An image or online description alone cannot confirm the underlying cause of a building defect.',
    'Hidden structural, electrical, or plumbing issues may exist behind visible surface finishes.',
    'Troubleshooting steps are designed for safe observation only; never attempt dangerous DIY repairs.',
  ]

  return {
    reportedIssue: category,
    priority,
    priorityTitle,
    priorityDescription,
    visibleSymptoms,
    userReportedSymptoms: userReported,
    possibleExplanations,
    missingInformation,
    recommendedNextStep,
    troubleshootingSteps,
    isEscalationRecommended,
    escalationReason,
    cautionaryNotes,
  }
}
