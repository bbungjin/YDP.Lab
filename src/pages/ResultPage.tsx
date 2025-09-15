import './pages.css'
import { type ModelResponse } from '../types'

type Props = {
  result: ModelResponse | null
  loading: boolean
  error?: string
  onRetry?: () => void
  onRestart: () => void
}

export default function ResultPage({ result, loading, error, onRetry, onRestart }: Props) {
  if (loading) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <div className="spinner mx-auto mb-4" />
        <div className="text-sm text-gray-500">모델 분석 중입니다...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <p className="text-red-600 mb-4">오류가 발생했습니다: {error}</p>
        <div className="flex gap-2">
          {onRetry && (
            <button className="flex-1 py-3 rounded-md border" onClick={onRetry}>다시 시도</button>
          )}
          <button className="flex-1 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black" onClick={onRestart}>
            처음으로
          </button>
        </div>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="p-6 max-w-md mx-auto text-left">
      <h2 className="text-2xl font-bold mb-1">{result.animalName}</h2>
      <p className="text-gray-600 mb-4">{result.animalType}</p>
      <p className="mb-6">{result.animalDescription}</p>

      <div className="space-y-3">
        <section>
          <h3 className="font-semibold mb-1">핵심 설명</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{result.description}</p>
        </section>
        <section>
          <h3 className="font-semibold mb-1">분석 요약</h3>
          {/* <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
            <li>목적: {result.analyze.purpose}</li>
            <li>시간 패턴: {result.analyze.timePattern}</li>
            <li>
              흥미 요소:
              <ul className="list-disc list-inside pl-4">
                {result.analyze.interesting.map((it: string, idx: number) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </li>
          </ul> */}
        </section>
      </div>

      <div className="pt-6">
        <button className="w-full py-3 rounded-md bg-black text-white dark:bg-white dark:text-black" onClick={onRestart}>
          다시 테스트하기
        </button>
      </div>
    </div>
  )
}


