
export type cardType = "start" | "go" | "left-rotate" | "right-rotate" | "for" | "temp"; 

export type card = {
  type: cardType
  temp: boolean
  index: number
  parent?: number
}
export type cardC = {
  type: cardType
  active?: boolean
  temp?: boolean
  cardIndex?: number
  func?: any
} & React.HTMLAttributes<HTMLElement>

export type sortCardC = {
  index: number
  parent?: number
} & cardC

export type draggableCard = {
  type: 'card' | 'sortCard'
  index: number
  aIndex?: number
  nowIndex?: number
  sort?: boolean
  data: {
    type: cardType
  }
}

export type cardSortEvent = {
  updateCard: (index: number) => void
  moveCard: (index1: number, index2: number) => void
  addingCard: (index: number) => void
  changeDraggingIndex: (index: number) => void
  dropCard: () => void
}