import api from './client'
import type { PieData, BarData, HistogramData } from '@/types/analytics'

export async function fetchPieData(): Promise<PieData> {
  const res = await api.get<PieData>('/analytics/pie/')
  return res.data
}

export async function fetchBarData(): Promise<BarData> {
  const res = await api.get<BarData>('/analytics/bar/')
  return res.data
}

export async function fetchHistogramData(): Promise<HistogramData> {
  const res = await api.get<HistogramData>('/analytics/histogram/')
  return res.data
}
