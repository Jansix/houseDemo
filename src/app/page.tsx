'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchFilters, {
  SearchFilters as SearchFiltersType,
} from '@/components/SearchFilters'
import HouseList from '@/components/HouseList'
import { houses, House } from '@/data/houses'
import config from '@/data/config'

export default function HomePage() {
  const [allHouses, setAllHouses] = useState<House[]>(houses)
  const [filteredHouses, setFilteredHouses] = useState<House[]>(houses)
  const [loading, setLoading] = useState(false)

  // 載入時從 localStorage 取得新增的房屋
  useEffect(() => {
    const newHouses = JSON.parse(localStorage.getItem('newHouses') || '[]')
    const combinedHouses = [...newHouses, ...houses]
    setAllHouses(combinedHouses)
    setFilteredHouses(combinedHouses)
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
            house.address
              .toLowerCase()
              .includes(filters.keyword.toLowerCase()) ||
            house.description
              .toLowerCase()
              .includes(filters.keyword.toLowerCase())
        )
      }

      // 城市篩選
      if (filters.city) {
        result = result.filter((house) => house.address.includes(filters.city))
      }

      // 區域篩選
      if (filters.district) {
        result = result.filter((house) =>
          house.address.includes(filters.district)
        )
      }

      // 價格篩選
      if (filters.minPrice > 0) {
        result = result.filter((house) => house.price >= filters.minPrice)
      }
      if (filters.maxPrice < 10000) {
        result = result.filter((house) => house.price <= filters.maxPrice)
      }

      // 坪數篩選
      if (filters.minArea > 0) {
        result = result.filter((house) => house.area >= filters.minArea)
      }
      if (filters.maxArea < 200) {
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
        result = result.filter((house) => house.type === filters.type)
      }

      setFilteredHouses(result)
      setLoading(false)
    }, 500)
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
        <Link
          href="/publish"
          className={`inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition duration-200 font-medium`}
        >
          + 免費刊登房屋
        </Link>
      </div>

      {/* 統計資訊 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
      </div>

      {/* 搜尋篩選器 */}
      <SearchFilters onSearch={handleSearch} />

      {/* 房屋列表 */}
      <HouseList houses={filteredHouses} loading={loading} />
    </div>
  )
}
