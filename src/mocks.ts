import type { ModelResponse, SurveyPayload } from './types'

export function buildMockResponse(payload: SurveyPayload): ModelResponse {
  const totalHours = payload.weekdayAvgLeisureTime * 5 + payload.weekendAvgLeisureTime * 2
  const dominant = Math.max(
    payload.restRecreationRate,
    payload.hobbyRate,
    payload.selfImprovementRate,
    payload.socialRelationshipRate
  )

  let animalName = '야옹이'
  let animalType = '야옹이는 독립적'
  let desc = '이 유형은 개인의 즐거움보다 관계 형성과 유지를 여가의 핵심 동력으로 삼습니다.'
  let animalDesc = '야옹이는 독립적인 동물입니다~어쩌구'

  if (dominant === payload.socialRelationshipRate) {
    animalName = '강아지'
    animalType = '강아지는 사회적'
    desc = '사람들과 함께하는 활동에서 에너지를 얻고 즐거움을 느낍니다.'
    animalDesc = '강아지는 교류를 사랑하고 팀 활동에 강점이 있어요.'
  } else if (dominant === payload.selfImprovementRate) {
    animalName = '부엉이'
    animalType = '부엉이는 탐구적'
    desc = '지식·기술을 확장하는 행위를 여가의 중요한 목표로 봅니다.'
    animalDesc = '부엉이는 호기심이 많고 집중력이 좋아요.'
  } else if (dominant === payload.hobbyRate) {
    animalName = '너구리'
    animalType = '너구리는 다재다능'
    desc = '취미 중심으로 다양한 활동을 시도하고 성취를 즐깁니다.'
    animalDesc = '너구리는 손재주가 좋고 적응력이 높습니다.'
  }

  const analyze = {
    purpose: `1순위 목적 코드 ${payload.leisurePurpose}, 2순위 ${payload.leisurePurpose2}`,
    timePattern: totalHours > 30 ? '활동적' : '온건',
    interesting: ['영화보기', '산책', '가벼운 운동'],
  }

  return {
    animalName,
    animalType,
    description: desc,
    animalDescription: animalDesc,
    analyze,
  }
}


