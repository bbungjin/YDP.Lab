// 타입 정의 및 설문 옵션

export enum HouseholdIncome {
  NoAnswer = 0,
  Under3M = 1,
  From3To5M = 2,
  From5To7M = 3,
  Over7M = 4,
}

export enum LeisurePurpose {
  MindPeaceRest = 1,
  KillTime = 2,
  FamilyFriends = 3,
  SelfSatisfaction = 4,
  SelfDevelopment = 5,
  StressRelief = 6,
  HealthCare = 7,
  SocialRelationship = 8,
  Etc = 9,
}

export enum LeisurePurpose2 {
  None = 0,
  MindPeaceRest = 1,
  KillTime = 2,
  FamilyFriends = 3,
  SelfSatisfaction = 4,
  SelfDevelopment = 5,
  StressRelief = 6,
  HealthCare = 7,
  SocialRelationship = 8,
  Etc = 9,
}

export enum LeisureActivity {
  None = 0,
  MediaContent = 1,
  Sports = 2,
  TravelOutdoor = 3,
  CultureArt = 4,
  SelfDevelopment = 5,
  SocialFamily = 6,
  DailyRest = 7,
  Etc = 8,
}

export type SurveyPayload = {
  householdIncome: HouseholdIncome
  leisurePurpose: LeisurePurpose
  leisurePurpose2: LeisurePurpose2
  weekdayAvgLeisureTime: number
  weekendAvgLeisureTime: number
  restRecreationRate: number
  hobbyRate: number
  selfImprovementRate: number
  socialRelationshipRate: number
  leisureActivity1: LeisureActivity
  leisureActivity2: LeisureActivity
  leisureActivity3: LeisureActivity
  leisureActivity4: LeisureActivity
  leisureActivity5: LeisureActivity
}

export type ModelAnalyze = {
  purpose: string
  timePattern: string
  interesting: string[]
}

export type ModelResponse = {
  animalName: string
  animalType: string
  description: string
  animalDescription: string
  analyze: ModelAnalyze
}

export const householdIncomeOptions: { value: HouseholdIncome; label: string }[] = [
  { value: HouseholdIncome.NoAnswer, label: '무응답' },
  { value: HouseholdIncome.Under3M, label: '300만원 미만' },
  { value: HouseholdIncome.From3To5M, label: '300 이상 500만원 미만' },
  { value: HouseholdIncome.From5To7M, label: '500 이상 700만원 미만' },
  { value: HouseholdIncome.Over7M, label: '700만원 이상' },
]

export const leisurePurposeOptions: { value: LeisurePurpose; label: string }[] = [
  { value: LeisurePurpose.MindPeaceRest, label: '마음의 안정·휴식을 위해' },
  { value: LeisurePurpose.KillTime, label: '남는 시간을 보내기 위해' },
  { value: LeisurePurpose.FamilyFriends, label: '가족·지인 등과 시간을 보내기 위해' },
  { value: LeisurePurpose.SelfSatisfaction, label: '자기만족·즐거움을 위해' },
  { value: LeisurePurpose.SelfDevelopment, label: '자기 계발을 위해' },
  { value: LeisurePurpose.StressRelief, label: '스트레스 해소를 위해' },
  { value: LeisurePurpose.HealthCare, label: '건강 관리를 위해' },
  { value: LeisurePurpose.SocialRelationship, label: '대인 관계·교제를 위해' },
  { value: LeisurePurpose.Etc, label: '기타' },
]

export const leisurePurpose2Options: { value: LeisurePurpose2; label: string }[] = [
  { value: LeisurePurpose2.None, label: '없음' },
  { value: LeisurePurpose2.MindPeaceRest, label: '마음의 안정·휴식을 위해' },
  { value: LeisurePurpose2.KillTime, label: '남는 시간을 보내기 위해' },
  { value: LeisurePurpose2.FamilyFriends, label: '가족·지인 등과 시간을 보내기 위해' },
  { value: LeisurePurpose2.SelfSatisfaction, label: '자기만족·즐거움을 위해' },
  { value: LeisurePurpose2.SelfDevelopment, label: '자기 계발을 위해' },
  { value: LeisurePurpose2.StressRelief, label: '스트레스 해소를 위해' },
  { value: LeisurePurpose2.HealthCare, label: '건강 관리를 위해' },
  { value: LeisurePurpose2.SocialRelationship, label: '대인 관계·교제를 위해' },
  { value: LeisurePurpose2.Etc, label: '기타' },
]

export const leisureActivityOptions: { value: LeisureActivity; label: string }[] = [
  { value: LeisureActivity.None, label: '없음' },
  { value: LeisureActivity.MediaContent, label: '미디어/콘텐츠' },
  { value: LeisureActivity.Sports, label: '스포츠/운동' },
  { value: LeisureActivity.TravelOutdoor, label: '여행/야외활동' },
  { value: LeisureActivity.CultureArt, label: '문화/예술' },
  { value: LeisureActivity.SelfDevelopment, label: '자기계발' },
  { value: LeisureActivity.SocialFamily, label: '사교/가족' },
  { value: LeisureActivity.DailyRest, label: '일상/휴식' },
  { value: LeisureActivity.Etc, label: '기타' },
]


