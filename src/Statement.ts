export enum Type {
  HTML = "html",
  TEXT = "text"
}

interface Breakdown {
  movie: string,
  amount: number
}

export type Statement = {
  name: string,
  breakdown: Breakdown[],
  total: number,
  points: number 
}