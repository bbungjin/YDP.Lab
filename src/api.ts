import { ModelResponse, SurveyPayload } from './types'
import { buildMockResponse } from './mocks'

const VITE_API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL
const VITE_USE_MOCK = (import.meta as any).env?.VITE_USE_MOCK
const isMock = VITE_USE_MOCK === 'true' || (import.meta as any).env?.DEV
const API_BASE_URL = VITE_API_BASE_URL || '/api'

export async function postSurvey(payload: SurveyPayload, signal?: AbortSignal): Promise<ModelResponse> {
  if (isMock) {
    // 네트워크 대기 시뮬레이션
    await new Promise((r) => setTimeout(r, 600))
    return buildMockResponse(payload)
  }
  const res = await fetch(`${API_BASE_URL}/survey`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed with ${res.status}`)
  }

  return (await res.json()) as ModelResponse
}


