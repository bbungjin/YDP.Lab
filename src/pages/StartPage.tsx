import './pages.css'

type Props = {
  onStart: () => void
}

export default function StartPage({ onStart }: Props) {
  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="text-left">
        <h1 className="text-2xl font-bold mb-2">여가 성향 테스트</h1>
        <p className="text-sm text-gray-500 mb-6">
          간단한 설문을 통해 당신의 여가 동물 유형을 알려드려요.
        </p>
      </div>
      <button className="w-full py-3 rounded-md bg-black text-white dark:bg-white dark:text-black" onClick={onStart}>
        테스트 시작하기
      </button>
    </div>
  )
}


