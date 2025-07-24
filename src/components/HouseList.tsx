'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { House } from '@/types/house'
import PriceComparison from './PriceComparison'

interface HouseCardProps {
  house: House
}

function HouseCard({ house }: HouseCardProps) {
  return (
    <Link href={`/houses/${house.house_id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden text-gray-900">
        {/* 圖片區域 */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={
              house.images && house.images.length > 0
                ? `https://house_demo.codychen.me${house.images[0]}`
                : ''
            }
            alt={house.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // 如果圖片載入失敗，隱藏圖片並顯示備用內容
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const fallback = target.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center text-gray-500"
            style={{ display: 'none' }}
          >
            <span>房屋圖片</span>
          </div>
          {/* 價格標籤 */}
          <div className="absolute top-3 right-3">
            <PriceComparison
              currentPrice={house.price}
              previousPrice={house.previous_price}
              listingType={house.listing_type}
              variant="compact"
            />
          </div>
        </div>

        {/* 內容區域 */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {house.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3">📍 {house.addr}</p>

          {/* 房屋資訊 */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              🏠 {house.rooms}房{house.bathrooms}衛
            </span>
            <span className="flex items-center gap-1">📐 {house.area}坪</span>
            <span className="flex items-center gap-1">
              🏢 {house.current_floor}/{house.total_floor}樓
            </span>
          </div>

          {/* 物件類型 */}
          <div className="flex items-center justify-between">
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {house.house_type}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(house.posted_date).toLocaleDateString('zh-TW')}
            </span>
          </div>

          {/* 特色標籤 */}
          <div className="flex flex-wrap gap-1 mt-3">
            {house.features &&
              house.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-block bg-primary-200 text-white px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
            {house.features && house.features.length > 3 && (
              <span className="text-xs text-gray-500">
                +{house.features.length - 3}個特色
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'area-large'

interface HouseListProps {
  houses: House[]
  loading?: boolean
  onSortChange?: (sortedHouses: House[]) => void
}

export default function HouseList({
  houses,
  loading = false,
  onSortChange,
}: HouseListProps) {
  const [sortOption, setSortOption] = useState<SortOption>('newest')

  // 排序邏輯
  const sortHouses = (housesToSort: House[], option: SortOption): House[] => {
    const sorted = [...housesToSort]

    switch (option) {
      case 'newest':
        return sorted.sort(
          (a, b) =>
            new Date(b.posted_date).getTime() -
            new Date(a.posted_date).getTime()
        )
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'area-large':
        return sorted.sort((a, b) => b.area - a.area)
      default:
        return sorted
    }
  }

  // 當排序選項改變時
  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption)
    const sortedHouses = sortHouses(houses, newSortOption)
    onSortChange?.(sortedHouses)
  }

  // 當 houses 改變時，重新排序
  useEffect(() => {
    if (houses.length > 0) {
      const sortedHouses = sortHouses(houses, sortOption)
      onSortChange?.(sortedHouses)
    }
  }, [houses, sortOption])

  const displayHouses = sortHouses(houses, sortOption)
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (houses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          沒有找到符合條件的房屋
        </h3>
        <p className="text-gray-500">請調整搜尋條件或瀏覽其他房屋</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          找到 {houses.length} 間房屋
        </h2>
        <select
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="newest">最新刊登</option>
          <option value="price-low">價格低到高</option>
          <option value="price-high">價格高到低</option>
          <option value="area-large">坪數大到小</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayHouses.map((house) => (
          <HouseCard key={house.house_id} house={house} />
        ))}
      </div>
    </div>
  )
}
