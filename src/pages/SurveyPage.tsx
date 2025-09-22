import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import './pages.css'
import {
  householdIncomeOptions,
  leisurePurpose2Options,
  leisurePurposeOptions,
  leisureActivityOptions,
  HouseholdIncome,
  LeisurePurpose,
  LeisurePurpose2,
  LeisureActivity,
  type SurveyPayload,
} from '../types'

type Props = {
  onSubmit: (payload: SurveyPayload) => void
  onBack?: () => void
}

export default function SurveyPage({ onSubmit, onBack }: Props) {
  const [form, setForm] = useState<SurveyPayload>({
    householdIncome: HouseholdIncome.NoAnswer,
    leisurePurpose: LeisurePurpose.MindPeaceRest,
    leisurePurpose2: LeisurePurpose2.None,
    weekdayAvgLeisureTime: 0,
    weekendAvgLeisureTime: 0,
    restRecreationRate: 0,
    hobbyRate: 0,
    selfImprovementRate: 0,
    socialRelationshipRate: 0,
    leisureActivity1: LeisureActivity.None,
    leisureActivity2: LeisureActivity.None,
    leisureActivity3: LeisureActivity.None,
    leisureActivity4: LeisureActivity.None,
    leisureActivity5: LeisureActivity.None,
  })

  // 단계형 설문 진행 인덱스
  const [stepIndex, setStepIndex] = useState<number>(0)

  // "관심 여가활동 1순위"는 선택 전에는 다음 단계로 못 넘어가도록 선택 여부만 추적
  const [hasPickedActivity1, setHasPickedActivity1] = useState<boolean>(false)

  const totalRate = useMemo(
    () =>
      form.restRecreationRate +
      form.hobbyRate +
      form.selfImprovementRate +
      form.socialRelationshipRate,
    [form]
  )

  const canSubmit = useMemo(() => totalRate === 100, [totalRate])

  function handleNumber(name: keyof SurveyPayload, value: string) {
    const num = Number(value)
    setForm((prev) => ({ ...prev, [name]: isNaN(num) ? 0 : num }))
  }

  function handleSelect<T extends keyof SurveyPayload>(name: T, value: number, autoNext?: boolean) {
    setForm((prev) => ({ ...prev, [name]: value as any }))
    if (autoNext) {
      goNext()
    }
  }

  function goPrev() {
    setStepIndex((idx) => Math.max(0, idx - 1))
  }

  function goNext() {
    setStepIndex((idx) => Math.min(9, idx + 1))
  }

  function submit() {
    onSubmit(form)
  }

  // 소득 단계 애니메이션 컨테이너 및 헬퍼
  const incomeAnimRef = useRef<HTMLDivElement | null>(null)

  function getMoneyCountByIncome(value: HouseholdIncome): number {
    switch (value) {
      case HouseholdIncome.Over7M:
        return 5
      case HouseholdIncome.From5To7M:
        return 4
      case HouseholdIncome.From3To5M:
        return 3
      case HouseholdIncome.Under3M:
        return 2
      case HouseholdIncome.NoAnswer:
      default:
        return 1
    }
  }

  function burstMoney(count: number, originX: number, originY: number) {
    const container = incomeAnimRef.current
    if (!container) return

    for (let i = 0; i < count; i++) {
      const money = document.createElement('div')
      money.innerText = '💵'
      money.style.position = 'absolute'
      money.style.left = `${originX}px`
      money.style.top = `${originY}px`
      money.style.pointerEvents = 'none'
      money.style.fontSize = '22px'
      money.style.willChange = 'transform, opacity'
      container.appendChild(money)

      const x = (Math.random() - 0.5) * 200
      const y = -100 - Math.random() * 100
      const rotate = (Math.random() - 0.5) * 90

      gsap.to(money, {
        x,
        y,
        rotation: rotate,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => money.remove(),
      })
    }
  }

  function renderTwoColumnButtons(
    options: { value: number; label: string }[],
    selectedValue: number | null,
    onSelectValue: (value: number) => void
  ) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isActive = selectedValue === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              className={`py-3 rounded-md border ${isActive ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
              onClick={() => onSelectValue(opt.value)}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  }

  const stepContent = (
    <div className="space-y-4">
      {stepIndex === 0 && (
        <div ref={incomeAnimRef} className="relative">
          <label className="block text-sm mb-1">당신의 월 가구 소득 정도를 선택해주세요.</label>
          <div className="grid grid-cols-2 gap-2">
            {householdIncomeOptions.map((opt) => {
              const isActive = form.householdIncome === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`py-3 rounded-md border ${isActive ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
                  onClick={(e) => {
                    handleSelect('householdIncome', opt.value)
                    const container = incomeAnimRef.current
                    if (!container) return
                    const containerRect = container.getBoundingClientRect()
                    const btnRect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                    const originX = btnRect.left - containerRect.left + btnRect.width / 2
                    const originY = btnRect.top - containerRect.top + btnRect.height / 2
                    const count = getMoneyCountByIncome(opt.value)
                    burstMoney(count, originX, originY)
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {stepIndex === 1 && (
        <div>
          <label className="block text-sm mb-1">여가시간의 사용 목적 1순위는 무엇일까요?</label>
          {renderTwoColumnButtons(
            leisurePurposeOptions,
            form.leisurePurpose,
            (v) => handleSelect('leisurePurpose', v)
          )}
        </div>
      )}

      {stepIndex === 2 && (
        <div>
          <label className="block text-sm mb-1">여가시간의 사용 목적 2순위는 무엇일까요?</label>
          {renderTwoColumnButtons(
            leisurePurpose2Options,
            form.leisurePurpose2,
            (v) => handleSelect('leisurePurpose2', v)
          )}
        </div>
      )}

      {stepIndex === 3 && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">일평균 여가시간을 적어주세요. (평일)</label>
            <input
              className="w-full input"
              type="number"
              min={0}
              max={24}
              placeholder="0 ~ 24"
              value={form.weekdayAvgLeisureTime}
              onChange={(e) => handleNumber('weekdayAvgLeisureTime', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">일평균 여가시간을 적어주세요. (주말)</label>
            <input
              className="w-full input"
              type="number"
              min={0}
              max={24}
              placeholder="0 ~ 24"
              value={form.weekendAvgLeisureTime}
              onChange={(e) => handleNumber('weekendAvgLeisureTime', e.target.value)}
            />
          </div>
        </div>
      )}

      {stepIndex === 4 && (
        <div>
          <label className="block text-sm mb-1">여가시간 중 사용 비율을 적어주세요.</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">휴식·오락 (%)</label>
              <input
                className={`w-full input ${totalRate !== 100 ? 'invalid' : ''}`}
                type="number"
                min={0}
                max={100}
                value={form.restRecreationRate}
                onChange={(e) => handleNumber('restRecreationRate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">취미 (%)</label>
              <input
                className={`w-full input ${totalRate !== 100 ? 'invalid' : ''}`}
                type="number"
                min={0}
                max={100}
                value={form.hobbyRate}
                onChange={(e) => handleNumber('hobbyRate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">본인계발 (%)</label>
              <input
                className={`w-full input ${totalRate !== 100 ? 'invalid' : ''}`}
                type="number"
                min={0}
                max={100}
                value={form.selfImprovementRate}
                onChange={(e) => handleNumber('selfImprovementRate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">대인관계·교제 (%)</label>
              <input
                className={`w-full input ${totalRate !== 100 ? 'invalid' : ''}`}
                type="number"
                min={0}
                max={100}
                value={form.socialRelationshipRate}
                onChange={(e) => handleNumber('socialRelationshipRate', e.target.value)}
              />
            </div>
          </div>
          <div className="text-xs text-gray-500">합계: {totalRate}% {totalRate !== 100 && '(총합이 100이 되어야 합니다!)'}</div>
        </div>
      )}

      {stepIndex === 5 && (
        <div>
          <label className="block text-sm mb-1">관심 여가활동의 1순위를 골라주세요</label>
          {renderTwoColumnButtons(
            leisureActivityOptions,
            hasPickedActivity1 ? form.leisureActivity1 : null,
            (v) => {
              setHasPickedActivity1(true)
              handleSelect('leisureActivity1', v)
            }
          )}
        </div>
      )}

      {stepIndex === 6 && (
        <div>
          <label className="block text-sm mb-1">관심 여가활동의 2순위를 골라주세요</label>
          {renderTwoColumnButtons(
            leisureActivityOptions,
            form.leisureActivity2,
            (v) => handleSelect('leisureActivity2', v)
          )}
        </div>
      )}

      {stepIndex === 7 && (
        <div>
          <label className="block text-sm mb-1">관심 여가활동의 3순위를 골라주세요</label>
          {renderTwoColumnButtons(
            leisureActivityOptions,
            form.leisureActivity3,
            (v) => handleSelect('leisureActivity3', v)
          )}
        </div>
      )}

      {stepIndex === 8 && (
        <div>
          <label className="block text-sm mb-1">관심 여가활동의 4순위를 골라주세요</label>
          {renderTwoColumnButtons(
            leisureActivityOptions,
            form.leisureActivity4,
            (v) => handleSelect('leisureActivity4', v)
          )}
        </div>
      )}

      {stepIndex === 9 && (
        <div>
          <label className="block text-sm mb-1">관심 여가활동의 5순위를 골라주세요</label>
          {renderTwoColumnButtons(
            leisureActivityOptions,
            form.leisureActivity5,
            (v) => handleSelect('leisureActivity5', v)
          )}
        </div>
      )}
    </div>
  )

  const canGoNext = useMemo(() => {
    if (stepIndex === 3) {
      const inRange =
        form.weekdayAvgLeisureTime >= 0 &&
        form.weekdayAvgLeisureTime <= 24 &&
        form.weekendAvgLeisureTime >= 0 &&
        form.weekendAvgLeisureTime <= 24
      return inRange
    }
    if (stepIndex === 4) {
      const eachInRange =
        form.restRecreationRate >= 0 && form.restRecreationRate <= 100 &&
        form.hobbyRate >= 0 && form.hobbyRate <= 100 &&
        form.selfImprovementRate >= 0 && form.selfImprovementRate <= 100 &&
        form.socialRelationshipRate >= 0 && form.socialRelationshipRate <= 100
      return eachInRange && totalRate === 100
    }
    if (stepIndex === 5) {
      return hasPickedActivity1
    }
    // 선택형 문항은 선택 후 '다음' 버튼으로 진행
    return true
  }, [stepIndex, form, totalRate, hasPickedActivity1])

  const isLastStep = stepIndex === 9

  return (
    <div className="p-4 max-w-md mx-auto text-left">
      <h2 className="text-xl font-semibold mb-4">설문 입력</h2>

      {stepContent}

      <div className="flex gap-2 pt-4">
        {stepIndex > 0 ? (
          <button className="flex-1 py-3 rounded-md border" onClick={goPrev}>
            이전
          </button>
        ) : (
          onBack && (
            <button className="flex-1 py-3 rounded-md border" onClick={onBack}>
              이전
            </button>
          )
        )}

        {!isLastStep ? (
          <button
            className="flex-1 py-3 rounded-md bg-black text-white disabled:opacity-50 dark:bg-white dark:text-black"
            disabled={!canGoNext}
            onClick={goNext}
          >
            다음
          </button>
        ) : (
          <button
            className="flex-1 py-3 rounded-md bg-black text-white disabled:opacity-50 dark:bg-white dark:text-black"
            disabled={!canSubmit}
            onClick={submit}
          >
            제출하기
          </button>
        )}
      </div>
    </div>
  )
}


