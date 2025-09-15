import { useMemo, useState } from 'react'
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

  function handleSelect<T extends keyof SurveyPayload>(name: T, value: number) {
    setForm((prev) => ({ ...prev, [name]: value as any }))
  }

  function submit() {
    onSubmit(form)
  }

  return (
    <div className="p-4 max-w-md mx-auto text-left">
      <h2 className="text-xl font-semibold mb-4">설문 입력</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">가구 소득 정도</label>
          <select
            className="w-full input"
            value={form.householdIncome}
            onChange={(e) => handleSelect('householdIncome', Number(e.target.value))}
          >
            {householdIncomeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">레저시간 사용 목적 - 1순위</label>
          <select
            className="w-full input"
            value={form.leisurePurpose}
            onChange={(e) => handleSelect('leisurePurpose', Number(e.target.value))}
          >
            {leisurePurposeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">레저시간 사용 목적 - 2순위</label>
          <select
            className="w-full input"
            value={form.leisurePurpose2}
            onChange={(e) => handleSelect('leisurePurpose2', Number(e.target.value))}
          >
            {leisurePurpose2Options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">평일 일평균 레저시간 (시간)</label>
            <input
              className="w-full input"
              type="number"
              min={0}
              value={form.weekdayAvgLeisureTime}
              onChange={(e) => handleNumber('weekdayAvgLeisureTime', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">주말 일평균 레저시간 (시간)</label>
            <input
              className="w-full input"
              type="number"
              min={0}
              value={form.weekendAvgLeisureTime}
              onChange={(e) => handleNumber('weekendAvgLeisureTime', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">휴식·오락 비율 (%)</label>
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
            <label className="block text-sm mb-1">취미 비율 (%)</label>
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
            <label className="block text-sm mb-1">본인계발 비율 (%)</label>
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
            <label className="block text-sm mb-1">대인관계·교제 비율 (%)</label>
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
        <div className="text-xs text-gray-500">합계: {totalRate}% {totalRate !== 100 && '(100%가 되도록 맞춰주세요)'}</div>

        <div className="grid grid-cols-1 gap-2">
          {[1, 2, 3, 4, 5].map((rank) => (
            <div key={rank}>
              <label className="block text-sm mb-1">관심 레저활동 {rank}순위</label>
              <select
                className="w-full input"
                value={form[`leisureActivity${rank as 1 | 2 | 3 | 4 | 5}`] as number}
                onChange={(e) =>
                  handleSelect(
                    `leisureActivity${rank as 1 | 2 | 3 | 4 | 5}` as any,
                    Number(e.target.value)
                  )
                }
              >
                {leisureActivityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          {onBack && (
            <button className="flex-1 py-3 rounded-md border" onClick={onBack}>
              이전
            </button>
          )}
          <button
            className="flex-1 py-3 rounded-md bg-black text-white disabled:opacity-50 dark:bg-white dark:text-black"
            disabled={!canSubmit}
            onClick={submit}
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  )
}


