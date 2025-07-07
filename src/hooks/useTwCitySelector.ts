import { useState, useEffect } from 'react'

interface TwCitySelectorData {
  cities: string[]
  getDistricts: (city: string) => string[]
}

export function useTwCitySelector(): TwCitySelectorData {
  const [cities] = useState<string[]>([
    '台北市',
    '新北市',
    '桃園市',
    '台中市',
    '台南市',
    '高雄市',
  ])

  const districts: Record<string, string[]> = {
    台北市: ['大安區', '信義區', '中山區', '松山區', '內湖區', '士林區'],
    新北市: ['板橋區', '新莊區', '中和區', '永和區', '土城區', '樹林區'],
    桃園市: ['中壢區', '桃園區', '平鎮區', '八德區', '蘆竹區', '大溪區'],
    台中市: ['西屯區', '北屯區', '南屯區', '大里區', '太平區', '豐原區'],
    台南市: ['安平區', '中西區', '東區', '南區', '北區', '安南區'],
    高雄市: ['前金區', '新興區', '鼓山區', '左營區', '三民區', '苓雅區'],
  }

  const getDistricts = (city: string): string[] => {
    return districts[city] || []
  }

  return {
    cities,
    getDistricts,
  }
}
