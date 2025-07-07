'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchFilters, {
  SearchFilters as SearchFiltersType,
} from '@/components/SearchFilters'
import HouseList from '@/components/HouseList'
import { houses, House } from '@/data/houses'

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
    <div className="min-h-screen">
      {/* 英雄區塊 */}
      <section className="relative morandi-gradient-bg pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 morandi-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold morandi-text-primary mb-6 leading-tight">
              尋找您的
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                理想居所
              </span>
            </h1>
            <p className="text-xl morandi-text-secondary max-w-3xl mx-auto leading-relaxed mb-8">
              精選優質房屋，使用進階篩選功能找到最適合您的房屋
            </p>
            <Link
              href="/publish"
              className="morandi-button-accent inline-flex items-center space-x-2"
            >
              <span>✨</span>
              <span>免費刊登房屋</span>
            </Link>
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-8 text-sm morandi-text-muted">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-400 rounded-full"></div>
                  <span>專業房仲</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-secondary-400 rounded-full"></div>
                  <span>實價登錄</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
                  <span>安心交易</span>
                </div>
              </div>
            </div>
          </div>

          {/* 搜尋區域 */}
          <div className="max-w-5xl mx-auto morandi-fade-in">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* 統計資訊 */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center morandi-fade-in">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {allHouses.length}
              </div>
              <div className="morandi-text-secondary font-medium">總物件數</div>
            </div>
            <div className="text-center morandi-fade-in">
              <div className="text-4xl font-bold text-secondary-600 mb-2">
                {allHouses.filter((h) => h.type === 'apartment').length}
              </div>
              <div className="morandi-text-secondary font-medium">公寓</div>
            </div>
            <div className="text-center morandi-fade-in">
              <div className="text-4xl font-bold text-accent-600 mb-2">
                {allHouses.filter((h) => h.type === 'house').length}
              </div>
              <div className="morandi-text-secondary font-medium">透天厝</div>
            </div>
            <div className="text-center morandi-fade-in">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {allHouses.filter((h) => h.type === 'villa').length}
              </div>
              <div className="morandi-text-secondary font-medium">別墅</div>
            </div>
          </div>
        </div>
      </section>

      {/* 房屋列表 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold morandi-text-primary mb-2">
                精選物件
              </h2>
              <p className="morandi-text-secondary">
                找到{' '}
                <span className="font-semibold text-accent-600">
                  {filteredHouses.length}
                </span>{' '}
                個符合條件的物件
              </p>
            </div>
          </div>

          <HouseList houses={filteredHouses} loading={loading} />
        </div>
      </section>
    </div>
  )
}
