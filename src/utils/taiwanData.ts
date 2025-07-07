// 台灣地區資料備份，防止主資料載入失敗
export const fallbackCities = [
  '台北市',
  '新北市',
  '桃園市',
  '台中市',
  '台南市',
  '高雄市',
]

export const fallbackDistricts = {
  台北市: ['大安區', '信義區', '中山區', '松山區', '內湖區', '士林區'],
  新北市: ['板橋區', '新莊區', '中和區', '永和區', '土城區', '樹林區'],
  桃園市: ['中壢區', '桃園區', '平鎮區', '八德區', '蘆竹區', '大溪區'],
  台中市: ['西屯區', '北屯區', '南屯區', '大里區', '太平區', '豐原區'],
  台南市: ['安平區', '中西區', '東區', '南區', '北區', '安南區'],
  高雄市: ['前金區', '新興區', '鼓山區', '左營區', '三民區', '苓雅區'],
}

// 安全的地區資料取得函數
export function getSafeCities(): string[] {
  try {
    const { cities } = require('@/data/houses')
    return Array.isArray(cities) && cities.length > 0 ? cities : fallbackCities
  } catch (error) {
    console.warn('無法載入主要地區資料，使用備份資料:', error)
    return fallbackCities
  }
}

export function getSafeDistricts(city: string): string[] {
  if (!city || typeof city !== 'string') return []

  try {
    const { getDistrictsByCity } = require('@/data/houses')
    const districts = getDistrictsByCity(city)
    return Array.isArray(districts) && districts.length > 0
      ? districts
      : fallbackDistricts[city as keyof typeof fallbackDistricts] || []
  } catch (error) {
    console.warn('無法載入主要區域資料，使用備份資料:', error)
    return fallbackDistricts[city as keyof typeof fallbackDistricts] || []
  }
}
