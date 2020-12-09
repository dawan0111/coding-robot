export type coinT = "carrot" | "start-left" | "start-right" | "start-up" | "start-down" | "empty"
export const coins:Array<coinT> = ["carrot", "start-left", "start-right", "start-up", "start-down", "empty"]

export function isStartCoin(coin: coinT): boolean {
  return ["start-left", "start-right", "start-up", "start-down"].includes(coin)
}