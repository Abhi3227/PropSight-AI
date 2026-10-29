import type { PriorityLevel } from './assessmentEngine'

export type RequestType =
  | 'inspection'
  | 'quote'
  | 'advice'
  | 'urgent'

export interface ServiceRequestRecord {
  referenceNumber: string
  createdAt: string
  requestType: RequestType
  contact: {
    fullName: string
    email: string
    phone?: string
    postcode: string
    preferredContact: string
    additionalNotes?: string
  }
  issue: {
    category: string
    location: string
    description: string
    priority: PriorityLevel
    stepsCompletedCount: number
    totalStepsCount: number
    outcomeReported: string
    hasImage: boolean
  }
}

/**
 * Modular mock submission handler.
 * Ready to be connected to a real API endpoint via POST /api/v1/service-requests
 */
export async function submitServiceRequestAPI(
  payload: ServiceRequestRecord
): Promise<{ success: boolean; referenceNumber: string }> {
  // Simulate network latency for prototype
  await new Promise((r) => setTimeout(r, 1200))

  // Persist locally for session demo
  try {
    const existing = JSON.parse(
      localStorage.getItem('propsight_demo_requests') || '[]'
    )
    existing.unshift(payload)
    localStorage.setItem('propsight_demo_requests', JSON.stringify(existing.slice(0, 10)))
  } catch {
    // Ignore storage quota in mock
  }

  return { success: true, referenceNumber: payload.referenceNumber }
}
