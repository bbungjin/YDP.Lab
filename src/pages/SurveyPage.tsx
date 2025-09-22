import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import './pages.css'
import dol1 from '../assets/dolphine-1.png'
import dol2 from '../assets/dolphine-2.png'
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

  // number 입력 포커스 시 기본값 0을 빈 문자열로 보여주기 위한 포커스 상태
  const [weekdayFocus, setWeekdayFocus] = useState<boolean>(false)
  const [weekendFocus, setWeekendFocus] = useState<boolean>(false)
  const [restRateFocus, setRestRateFocus] = useState<boolean>(false)
  const [hobbyRateFocus, setHobbyRateFocus] = useState<boolean>(false)
  const [selfImproveRateFocus, setSelfImproveRateFocus] = useState<boolean>(false)
  const [socialRateFocus, setSocialRateFocus] = useState<boolean>(false)

  // 진행 바 관련 refs 및 진행률 계산
  const progressContainerRef = useRef<HTMLDivElement | null>(null)
  const progressFillRef = useRef<HTMLDivElement | null>(null)
  const progressDolphinRef = useRef<HTMLDivElement | null>(null)
  const progressSwapTlRef = useRef<gsap.core.Timeline | null>(null)
  const progressTlRef = useRef<gsap.core.Animation | null>(null)
  const totalSteps = 10
  const progressAnimDuration = 1.2
  const progressPercent = useMemo(() => {
    const pct = (stepIndex / (totalSteps - 1)) * 100
    return Math.max(0, Math.min(100, Math.round(pct)))
  }, [stepIndex])

  // 돌고래 교체/바운스 애니메이션 (한 번 설정)
  useLayoutEffect(() => {
    const el = progressDolphinRef.current
    if (!el) return
    const imgs = el.querySelectorAll('img')
    if (imgs.length < 2) return
    const img1 = imgs[0] as HTMLImageElement
    const img2 = imgs[1] as HTMLImageElement
    gsap.set(img1, { opacity: 1 })
    gsap.set(img2, { opacity: 0 })
    const bob = gsap.to(el, { y: -10, rotation: 3, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    const swap = gsap.timeline({ repeat: -1 })
      .to(img1, { opacity: 0, duration: 0.2, ease: 'sine.inOut' })
      .to(img2, { opacity: 1, duration: 0.2, ease: 'sine.inOut' }, '<')
      .to({}, { duration: 0.4 })
      .to(img1, { opacity: 1, duration: 0.2, ease: 'sine.inOut' })
      .to(img2, { opacity: 0, duration: 0.2, ease: 'sine.inOut' }, '<')
      .to({}, { duration: 0.4 })
    progressSwapTlRef.current = swap
    return () => {
      bob.kill()
      swap.kill()
    }
  }, [])

  // 진행률 변화 시 막대 채우기/돌고래 이동 애니메이션
  useLayoutEffect(() => {
    const fill = progressFillRef.current
    const marker = progressDolphinRef.current
    const container = progressContainerRef.current
    if (!fill || !marker || !container) return
    // 기존 진행 타임라인 중단 후 새로 생성
    progressTlRef.current && progressTlRef.current.kill()
    // 시작 퍼센트를 현재 width 기준으로 계산
    const containerWidth = container.getBoundingClientRect().width
    const startPercent = containerWidth > 0 ? (fill.getBoundingClientRect().width / containerWidth) * 100 : 0
    const proxy = { p: startPercent }
    const tl = gsap.to(proxy, {
      p: progressPercent,
      duration: progressAnimDuration,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onUpdate: () => {
        const c = progressContainerRef.current
        const f = progressFillRef.current
        const m = progressDolphinRef.current
        if (!c || !f || !m) return
        f.style.width = `${proxy.p}%`
        const w = c.getBoundingClientRect().width
        const xNow = (w * proxy.p) / 100
        gsap.set(m, { x: xNow - 12 })
      },
    })
    progressTlRef.current = tl
    // 진행 중에는 돌고래 프레임 전환을 더 빠르게
    if (progressSwapTlRef.current) {
      progressSwapTlRef.current.timeScale(3)
      gsap.delayedCall(progressAnimDuration, () => {
        progressSwapTlRef.current && progressSwapTlRef.current.timeScale(1)
      })
    }
  }, [progressPercent])

  // 리사이즈 시 위치 보정
  useLayoutEffect(() => {
    const handler = () => {
      const marker = progressDolphinRef.current
      const container = progressContainerRef.current
      if (!marker || !container) return
      const rect = container.getBoundingClientRect()
      const x = (rect.width * progressPercent) / 100
      gsap.set(marker, { x: x - 12 })
    }
    window.addEventListener('resize', handler)
    handler()
    return () => window.removeEventListener('resize', handler)
  }, [progressPercent])

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
          <label className="block text-2xl mb-1">당신의 월 가구 소득 정도를 선택해주세요.</label>
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
          <label className="block text-2xl mb-1">여가시간의 사용 목적 1순위는 무엇일까요?</label>
          {renderTwoColumnButtons(
            leisurePurposeOptions,
            form.leisurePurpose,
            (v) => handleSelect('leisurePurpose', v)
          )}
        </div>
      )}

      {stepIndex === 2 && (
        <div>
          <label className="block text-2xl mb-1">여가시간의 사용 목적 2순위는 무엇일까요?</label>
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
            <label className="block text-2xl mb-1">일평균 여가시간을 적어주세요. (평일)</label>
            <input
              className="w-full input"
              type="number"
              min={0}
              max={24}
              placeholder="0 ~ 24"
              value={weekdayFocus && form.weekdayAvgLeisureTime === 0 ? '' : form.weekdayAvgLeisureTime}
              onChange={(e) => handleNumber('weekdayAvgLeisureTime', e.target.value)}
              onFocus={() => setWeekdayFocus(true)}
              onBlur={() => setWeekdayFocus(false)}
            />
          </div>
          <div>
            <label className="block text-2xl mb-1">일평균 여가시간을 적어주세요. (주말)</label>
            <input
              className="w-full input"
              type="number"
              min={0}
              max={24}
              placeholder="0 ~ 24"
              value={weekendFocus && form.weekendAvgLeisureTime === 0 ? '' : form.weekendAvgLeisureTime}
              onChange={(e) => handleNumber('weekendAvgLeisureTime', e.target.value)}
              onFocus={() => setWeekendFocus(true)}
              onBlur={() => setWeekendFocus(false)}
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
                value={restRateFocus && form.restRecreationRate === 0 ? '' : form.restRecreationRate}
                onChange={(e) => handleNumber('restRecreationRate', e.target.value)}
                onFocus={() => setRestRateFocus(true)}
                onBlur={() => setRestRateFocus(false)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">취미 (%)</label>
              <input
                className={`w-full input ${totalRate !== 100 ? 'invalid' : ''}`}
                type="number"
                min={0}
                max={100}
                value={hobbyRateFocus && form.hobbyRate === 0 ? '' : form.hobbyRate}
                onChange={(e) => handleNumber('hobbyRate', e.target.value)}
                onFocus={() => setHobbyRateFocus(true)}
                onBlur={() => setHobbyRateFocus(false)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">본인계발 (%)</label>
              <input
                className={`w-full input ${totalRate !== 100 ? 'invalid' : ''}`}
                type="number"
                min={0}
                max={100}
                value={selfImproveRateFocus && form.selfImprovementRate === 0 ? '' : form.selfImprovementRate}
                onChange={(e) => handleNumber('selfImprovementRate', e.target.value)}
                onFocus={() => setSelfImproveRateFocus(true)}
                onBlur={() => setSelfImproveRateFocus(false)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">대인관계·교제 (%)</label>
              <input
                className={`w-full input ${totalRate !== 100 ? 'invalid' : ''}`}
                type="number"
                min={0}
                max={100}
                value={socialRateFocus && form.socialRelationshipRate === 0 ? '' : form.socialRelationshipRate}
                onChange={(e) => handleNumber('socialRelationshipRate', e.target.value)}
                onFocus={() => setSocialRateFocus(true)}
                onBlur={() => setSocialRateFocus(false)}
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
            leisureActivityOptions.filter((o) => o.value !== LeisureActivity.None),
            hasPickedActivity1 ? form.leisureActivity1 : null,
            (v) => {
              if (v === LeisureActivity.None) return
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
      <h2 className="text-3xl font-semibold mb-3">설문 입력</h2>

      {/* 진행 바 + 돌고래 마커 */}
      <div className="mb-4 relative z-10">
        <div className="relative">
          <div ref={progressContainerRef} className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
            <div ref={progressFillRef} className="h-full bg-sky-400" style={{ width: '0%' }} />
          </div>
          <div ref={progressDolphinRef} className="absolute -top-5 left-0 z-10 flex items-center justify-center" style={{ width: 24, height: 24 }}>
            <img src={dol1} alt="dolphine-1" className="absolute w-6 h-6" />
            <img src={dol2} alt="dolphine-2" className="absolute w-6 h-6" />
          </div>
        </div>
        <div className="text-right text-xs text-gray-500 mt-1">{progressPercent}%</div>
      </div>

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


