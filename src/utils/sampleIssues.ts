export interface SampleIssue {
  id: string
  title: string
  badge: string
  badgeColor: string
  descriptionText: string
  category: string
  description: string
  location: string
  firstNoticed: string
  gettingWorse: string
  happenedBefore: string
  propertyType: string
  affectedArea: string
  afterRainOrPlumbing: string
  wideningCrack: string
  waterNearElectrics: string
  unstableStructure: string
  rapidLeak: string
  gasSmell: string
  expectedPriority: 'LOW' | 'MODERATE' | 'HIGH'
  suggestedOutcome: string
}

export const SAMPLE_ISSUES: SampleIssue[] = [
  {
    id: 'damp-wall',
    title: 'Damp-looking wall',
    badge: 'Moderate Priority',
    badgeColor: 'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/25',
    descriptionText: 'Discolouration & moisture spread on living room wall after rain.',
    category: 'Damp or Moisture',
    location: 'Living room',
    firstNoticed: 'Within the past week',
    gettingWorse: 'Yes',
    happenedBefore: 'No',
    propertyType: 'Terraced house',
    affectedArea: 'Approx 40 cm oval patch on exterior wall',
    afterRainOrPlumbing: 'After rain',
    wideningCrack: 'No',
    waterNearElectrics: 'No',
    unstableStructure: 'No',
    rapidLeak: 'No',
    gasSmell: 'No',
    description:
      'Noticeable patch of brownish-yellow damp staining on the lower section of the living room exterior wall, measuring roughly 40 cm across. Feels cold and slightly tacky to the touch, and appears noticeably darker and damper after heavy rainfall over the weekend.',
    expectedPriority: 'MODERATE',
    suggestedOutcome: 'Great for testing multi-step damp inspection and partial improvement / monitoring.',
  },
  {
    id: 'peeling-paint',
    title: 'Peeling paint near a window',
    badge: 'Low Priority',
    badgeColor: 'bg-[#16C784]/10 text-[#16C784] border-[#16C784]/25',
    descriptionText: 'Flaking paint on window reveal caused by winter condensation.',
    category: 'Peeling Paint',
    location: 'Bedroom',
    firstNoticed: 'Within the past month',
    gettingWorse: 'No',
    happenedBefore: 'Yes',
    propertyType: 'Flat / Apartment',
    affectedArea: 'Window reveal and frame edge (approx 50 cm)',
    afterRainOrPlumbing: 'Neither',
    wideningCrack: 'No',
    waterNearElectrics: 'No',
    unstableStructure: 'No',
    rapidLeak: 'No',
    gasSmell: 'No',
    description:
      'Flaking and peeling emulsion paint around the interior reveal of the bedroom window. The paint is lifting in curled flakes along the sill edge, but the plaster underneath feels relatively dry without major water staining.',
    expectedPriority: 'LOW',
    suggestedOutcome: 'Great for testing safe DIY surface preparation and resolved outcomes.',
  },
  {
    id: 'sink-leak',
    title: 'Water leakage under a sink',
    badge: 'High Priority',
    badgeColor: 'bg-red-50 text-red-600 border-red-200',
    descriptionText: 'Active dripping waste coupling creating water pool in kitchen unit.',
    category: 'Water Leakage',
    location: 'Kitchen',
    firstNoticed: 'Today',
    gettingWorse: 'Yes',
    happenedBefore: 'No',
    propertyType: 'Semi-detached house',
    affectedArea: 'Base of kitchen sink cabinet (25 cm pool)',
    afterRainOrPlumbing: 'After plumbing use',
    wideningCrack: 'No',
    waterNearElectrics: 'No',
    unstableStructure: 'No',
    rapidLeak: 'No',
    gasSmell: 'No',
    description:
      'Active dripping coming from the compression joint on the cold water waste pipe underneath the kitchen sink unit. Pool of standing water forming on the cabinet baseboard whenever the sink basin is emptied.',
    expectedPriority: 'HIGH',
    suggestedOutcome: 'Great for testing escalation, prompt shutoff steps, and contractor request.',
  },
  {
    id: 'emergency-test',
    title: 'Emergency Safety Test (Gas / Hazard)',
    badge: 'Emergency Triage',
    badgeColor: 'bg-red-600 text-white border-red-700',
    descriptionText: 'Tests instant safety redirect for suspected gas hazard.',
    category: 'Other',
    location: 'Kitchen',
    firstNoticed: 'Today',
    gettingWorse: 'Yes',
    happenedBefore: 'No',
    propertyType: 'Detached house',
    affectedArea: 'Boiler cupboard',
    afterRainOrPlumbing: 'Neither',
    wideningCrack: 'No',
    waterNearElectrics: 'No',
    unstableStructure: 'No',
    rapidLeak: 'No',
    gasSmell: 'Yes', // Triggers instant safety screen
    description:
      'Unusual strong sulphurous gas odour noticed coming from the boiler casing in the utility cupboard.',
    expectedPriority: 'HIGH',
    suggestedOutcome: 'Tests the emergency evacuation screen and 0800 111 999 hotline routing.',
  },
]
