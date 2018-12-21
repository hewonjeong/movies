export type AwardType = 'nominee' | 'winner'

export type Event = 'Golden Globe' | 'Oscar'

export interface Award {
  id: string // movieId (partition key)
  title: string
  event: Event
  year: number
  type: AwardType
  name?: string // 수상자
}
