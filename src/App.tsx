import { useCallback, useState } from 'react'
import './App.css'
import StartPage from './pages/StartPage'
import SurveyPage from './pages/SurveyPage'
import ResultPage from './pages/ResultPage'
import { SurveyPayload, ModelResponse } from './types'
import { postSurvey } from './api'

type Step = 'start' | 'survey' | 'result'

function App() {
  const [step, setStep] = useState<Step>('start')
  const [lastPayload, setLastPayload] = useState<SurveyPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [result, setResult] = useState<ModelResponse | null>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const start = useCallback(() => setStep('survey'), [])

  const restart = useCallback(() => {
    setStep('start')
    setResult(null)
    setError(undefined)
    setLastPayload(null)
  }, [])

  const submit = useCallback(async (payload: SurveyPayload) => {
    setLastPayload(payload)
    setStep('result')
    setLoading(true)
    setError(undefined)
    setResult(null)
    const ac = new AbortController()
    setAbortController(ac)
    try {
      const data = await postSurvey(payload, ac.signal)
      setResult(data)
    } catch (e: any) {
      setError(e?.message || '요청 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
      setAbortController(null)
    }
  }, [])

  const retry = useCallback(() => {
    if (lastPayload) submit(lastPayload)
  }, [lastPayload, submit])

  return (
    <div className="max-w-md w-full mx-auto">
      {step === 'start' && <StartPage onStart={start} />}
      {step === 'survey' && <SurveyPage onSubmit={submit} onBack={() => setStep('start')} />}
      {step === 'result' && (
        <ResultPage
          result={result}
          loading={loading}
          error={error}
          onRetry={lastPayload ? retry : undefined}
          onRestart={restart}
        />
      )}
    </div>
  )
}

export default App
