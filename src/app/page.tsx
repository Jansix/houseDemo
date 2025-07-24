'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchFilters from '@/components/SearchFilters'
import type { SearchFilters as SearchFiltersType } from '@/types/house'
import HouseList from '@/components/HouseList'
import { House } from '@/types/house'
import { houseService } from '@/services/houseService'

export default function HomePage() {
  const [allHouses, setAllHouses] = useState<House[]>([])
  const [filteredHouses, setFilteredHouses] = useState<House[]>([])
  const [sortedHouses, setSortedHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true) // 初始設為 true，載入 API 資料時
  const [error, setError] = useState<string | null>(null)

  // 載入時從 API 獲取房屋資料
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('開始獲取房屋列表...')

        // 從 API 獲取房屋資料
        const apiHouses = await houseService.getHouseList()
        console.log('API 房屋資料:', apiHouses)

        setAllHouses(apiHouses)
        setFilteredHouses(apiHouses)
        setSortedHouses(apiHouses)
        console.log('房屋列表載入成功，共', apiHouses.length, '筆資料')
      } catch (error) {
        console.error('獲取房屋列表失敗:', error)
        setError('無法載入房屋資料，請稍後再試')
      } finally {
        setLoading(false)
      }
    }

    fetchHouses()
  }, [])

  const handleSearch = (filters: SearchFiltersType) => {
    setLoading(true)

    // 模擬搜尋延遲
    setTimeout(() => {
      let result = [...allHouses]

      // 關鍵字篩選
      if (filters.keyword) {
        result = result.filter(
          (house) =>
            house.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            house.addr.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            house.description
              .toLowerCase()
              .includes(filters.keyword.toLowerCase())
        )
      }

      // 城市篩選
      if (filters.city) {
        result = result.filter((house) => house.addr.includes(filters.city))
      }

      // 區域篩選
      if (filters.district) {
        result = result.filter((house) => house.addr.includes(filters.district))
      }

      // 價格篩選
      if (filters.minPrice > 0) {
        result = result.filter((house) => house.price >= filters.minPrice)
      }
      if (filters.maxPrice > 0) {
        result = result.filter((house) => house.price <= filters.maxPrice)
      }

      // 坪數篩選
      if (filters.minArea > 0) {
        result = result.filter((house) => house.area >= filters.minArea)
      }
      if (filters.maxArea > 0) {
        result = result.filter((house) => house.area <= filters.maxArea)
      }

      // 房間數篩選
      if (filters.rooms) {
        if (filters.rooms === '5') {
          result = result.filter((house) => house.rooms >= 5)
        } else {
          result = result.filter(
            (house) => house.rooms === parseInt(filters.rooms)
          )
        }
      }

      // 物件類型篩選
      if (filters.type) {
        result = result.filter((house) => house.house_type === filters.type)
      }

      // 刊登類型篩選
      if (filters.listing_type) {
        result = result.filter(
          (house) => house.listing_type === filters.listing_type
        )
      }

      console.log('篩選結果:', result.length, '筆資料')
      setFilteredHouses(result)
      setSortedHouses(result)
      setLoading(false)
    }, 0)
  }

  // 處理排序變更
  const handleSortChange = (sortedHousesFromList: House[]) => {
    setSortedHouses(sortedHousesFromList)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 頁面標題 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          找房交給我們 🏠
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          精選優質房屋，使用進階篩選功能找到最適合您的房屋
        </p>
        {/* <Link
          href="/publish"
          className={`inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition duration-200 font-medium`}
        >
          + 免費刊登房屋
        </Link> */}
      </div>

      {/* 統計資訊 */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary-600">
            {allHouses.length}
          </div>
          <div className="text-sm text-gray-600">總物件數</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary-600">
            {allHouses.filter((h) => h.type === 'apartment').length}
          </div>
          <div className="text-sm text-gray-600">公寓</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary-600">
            {allHouses.filter((h) => h.type === 'house').length}
          </div>
          <div className="text-sm text-gray-600">透天厝</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary-600">
            {allHouses.filter((h) => h.type === 'villa').length}
          </div>
          <div className="text-sm text-gray-600">別墅</div>
        </div>
      </div> */}

      {/* 搜尋篩選器 */}
      <SearchFilters onSearch={handleSearch} />

      {/* 錯誤提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 房屋列表 */}
      <HouseList
        houses={filteredHouses}
        loading={loading}
        onSortChange={handleSortChange}
      />
    </div>
  )
}
