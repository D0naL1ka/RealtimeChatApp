export interface Message {
  id: number
  username: string
  text: string
  createdAt: string
  sentiment?: string
  positiveScore?: number
  negativeScore?: number
  neutralScore?: number
}