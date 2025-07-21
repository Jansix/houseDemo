// src/hooks/useTwCitySelector.ts
import { useState, useMemo } from 'react'
import allTaiwanRegions from '../data/tw-regions.json'

interface TwCitySelectorData {
  cities: string[]
  getDistricts: (city: string) => string[]
}

export function useTwCitySelector(): TwCitySelectorData {
  const cities = useMemo(() => Object.keys(allTaiwanRegions), [])

  const getDistricts = (city: string): string[] => {
    return (allTaiwanRegions as Record<string, string[]>)[city] || []
  }

  return {
    cities,
    getDistricts,
  }
}
