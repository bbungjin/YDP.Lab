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
          <h3 className="font-semibold mb-1">{(typeof result.analSummary === 'object' && !Array.isArray(result.analSummary) && (result.analSummary as any).bigTitle) || '분석 요약'}</h3>
          {/* 객체형 analSummary */}
          {typeof result.analSummary === 'object' && !Array.isArray(result.analSummary) && (result.analSummary as any).items && (
            <div className="space-y-2">
              {(result.analSummary as any).items.map((it: any, idx: number) => (
                <div key={idx}>
                  <div className="text-sm font-medium">{it.title || it.subtitle}</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{it.description || it.content}</p>
                </div>
              ))}
            </div>
          )}
          {/* 배열형 analSummary */}
          {Array.isArray(result.analSummary) && (
            <div className="space-y-2">
              {result.analSummary.map((it, idx) => (
                <div key={idx}>
                  <div className="text-sm font-medium">{(it as any).title || (it as any).subtitle}</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{(it as any).description || (it as any).content}</p>
                </div>
              ))}
            </div>
          )}
          {/* 기존 설명도 보조로 유지 */}
          {result.clusterDescription && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{result.clusterDescription}</p>
          )}
        </section>

        {Array.isArray(result.metrics) && result.metrics.length > 0 && (
          <section>
            <h3 className="font-semibold mb-1">핵심 지표</h3>
            <div className="space-y-2">
              {result.metrics.map((m, idx) => (
                <div key={idx}>
                  <div className="text-sm font-medium">{(m as any).title || (m as any).subtitle}</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{(m as any).description || (m as any).content}</p>
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


