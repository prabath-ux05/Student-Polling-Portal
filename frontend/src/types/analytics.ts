export interface PieData {
  labels: string[]
  series: number[]
}

export interface BarData {
  labels: string[]
  series: { name: string; data: number[] }[]
}

export interface HistogramData {
  labels: string[]
  series: { name: string; data: number[] }[]
}
