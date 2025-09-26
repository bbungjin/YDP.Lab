import './pages.css'
import { type ModelResponse } from '../types'
import { useMemo } from 'react'

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

  const analSummaryItems = useMemo(() => {
    const asAny: any = (result as any).analSummary
    if (!asAny) return []
    if (Array.isArray(asAny)) {
      return asAny.map((it: any) => ({ title: it.title || it.subtitle, description: it.description || it.content })).filter((x: any) => x.title || x.description)
    }
    if (typeof asAny === 'object' && Array.isArray(asAny.items)) {
      return asAny.items.map((it: any) => ({ title: it.title || it.subtitle, description: it.description || it.content })).filter((x: any) => x.title || x.description)
    }
    return []
  }, [result])

  const analSummaryTitle = useMemo(() => {
    const asAny: any = (result as any).analSummary
    return (asAny && !Array.isArray(asAny) && asAny.bigTitle) || '분석 요약'
  }, [result])

  const metricItems = useMemo(() => {
    const mAny: any = (result as any).metrics
    if (!Array.isArray(mAny)) return []
    return mAny.map((it: any) => ({ title: it.title || it.subtitle, description: it.description || it.content })).filter((x: any) => x.title || x.description)
  }, [result])

  return (
    <div className="p-6 max-w-md mx-auto text-left">
      {result.animalImageUrl && (
        <img
          src={result.animalImageUrl}
          alt={result.animalName}
          className="w-full h-120 object-cover rounded-md mb-4"
        />
      )}
      <h2 className="text-2xl font-bold mb-1">{result.animalName}</h2>
      <p className="text-gray-600 mb-2">{result.animalType}</p>
      {(result.animalTypeDescription || result.typeDescription || (result as any).typeDescriptoon) && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{result.animalTypeDescription || result.typeDescription || (result as any).typeDescriptoon}</p>
      )}
      <p className="mb-6">{result.animalDescription}</p>

      <div className="space-y-3">
        <section>
          <h3 className="font-semibold mb-1">핵심 설명</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{result.description}</p>
        </section>
        <section>
          <h3 className="font-semibold mb-1">{analSummaryTitle}</h3>
          {analSummaryItems.length > 0 && (
            <div className="space-y-2">
              {analSummaryItems.map((it: { title?: string; description?: string }, idx: number) => (
                <div key={idx}>
                  <div className="text-sm font-medium">{it.title}</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{it.description}</p>
                </div>
              ))}
            </div>
          )}
          {/* 기존 설명도 보조로 유지 */}
          {result.clusterDescription && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{result.clusterDescription}</p>
          )}
        </section>

        {metricItems.length > 0 && (
          <section>
            <h3 className="font-semibold mb-1">핵심 지표</h3>
            <div className="space-y-2">
              {metricItems.map((m: { title?: string; description?: string }, idx: number) => (
                <div key={idx}>
                  <div className="text-sm font-medium">{m.title}</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{m.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(result.interesting) && result.interesting.length > 0 && (
          <section>
            <h3 className="font-semibold mb-1">흥미 요소</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {result.interesting.map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="pt-6">
        <button className="w-full py-3 rounded-md bg-black text-white dark:bg-white dark:text-black" onClick={onRestart}>
          다시 테스트하기
        </button>
      </div>
    </div>
  )
}


