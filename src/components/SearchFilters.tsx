'use client'

import { useState } from 'react'
import { useTwCitySelector } from '@/hooks/useTwCitySelector'
import type { SearchFilters } from '@/types/house'

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const { cities, getDistricts } = useTwCitySelector()
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    city: '',
    district: '',
    minPrice: 0,
    maxPrice: 0,
    minArea: 0,
    maxArea: 0,
    rooms: '',
    type: '',
    listing_type: '',
  })

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string | number
  ) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // 如果是城市變更，清空區域選擇
    if (key === 'city') {
      newFilters.district = ''
      setFilters(newFilters)
    }
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      keyword: '',
      city: '',
      district: '',
      minPrice: 0,
      maxPrice: 0,
      minArea: 0,
      maxArea: 0,
      rooms: '',
      type: '',
      listing_type: '',
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-900">
      <h2 className="text-xl font-bold text-gray-800 mb-4">搜尋條件</h2>

      {/* 關鍵字搜尋和刊登類型 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <input
            type="text"
            placeholder="請輸入關鍵字（地址、標題等）"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={filters.listing_type}
            onChange={(e) => handleFilterChange('listing_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">所有類型</option>
            <option value="販售">🏠 販售</option>
            <option value="出租">🏘️ 出租</option>
          </select>
        </div>
      </div>

      {/* 地區選擇 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            城市
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">請選擇城市</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            區域
          </label>
          <select
            value={filters.district}
            onChange={(e) => handleFilterChange('district', e.target.value)}
            disabled={!filters.city}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">請選擇區域</option>
            {filters.city &&
              getDistricts(filters.city)?.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* 價格範圍 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            最低價格 (萬元/月)
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice || ''}
            onChange={(e) =>
              handleFilterChange('minPrice', parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            最高價格 (萬元/月)
          </label>
          <input
            type="number"
            placeholder="不限"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              handleFilterChange('maxPrice', parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 坪數範圍 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            最小坪數
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minArea || ''}
            onChange={(e) =>
              handleFilterChange('minArea', parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            最大坪數
          </label>
          <input
            type="number"
            placeholder="不限"
            value={filters.maxArea || ''}
            onChange={(e) =>
              handleFilterChange('maxArea', parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 房間數和類型 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            房間數
          </label>
          <select
            value={filters.rooms}
            onChange={(e) => handleFilterChange('rooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">不限</option>
            <option value="1">1房</option>
            <option value="2">2房</option>
            <option value="3">3房</option>
            <option value="4">4房</option>
            <option value="5">5房以上</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            物件類型
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">不限</option>
            <option value="公寓">公寓</option>
            <option value="透天">透天</option>
            <option value="別墅">別墅</option>
          </select>
        </div>
      </div>

      {/* 按鈕 */}
      <div className="flex gap-4">
        <button
          onClick={handleSearch}
          className={`flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition duration-200 font-medium`}
        >
          搜尋物件
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
        >
          重設條件
        </button>
      </div>
    </div>
  )
}
