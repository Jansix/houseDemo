'use client'

import Link from 'next/link'
import { House } from '@/data/houses'

interface HouseCardProps {
  house: House
}

function HouseCard({ house }: HouseCardProps) {
  const typeMap = {
    apartment: '公寓',
    house: '透天厝',
    villa: '別墅',
  }

  return (
    <Link href={`/houses/${house.id}`} className="block group">
      <div className="morandi-card-hover overflow-hidden transform group-hover:scale-105 transition-all duration-500">
        {/* 圖片區域 */}
        <div className="relative h-64 bg-background-100 overflow-hidden">
          <img
            src={house.images[0]}
            alt={house.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              // 如果圖片載入失敗，隱藏圖片並顯示備用內容
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const fallback = target.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center morandi-text-muted bg-background-50"
            style={{ display: 'none' }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🏠</div>
              <span>房屋圖片</span>
            </div>
          </div>

          {/* 價格標籤 */}
          <div className="absolute top-4 right-4">
            <div className="bg-accent-500 text-white px-4 py-2 rounded-xl font-bold shadow-soft">
              {house.price.toLocaleString()}萬
            </div>
          </div>

          {/* 物件類型標籤 */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm morandi-text-primary px-3 py-1 rounded-lg text-sm font-medium">
              {typeMap[house.type]}
            </div>
          </div>

          {/* 特色標籤 */}
          {house.features.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-2">
                {house.features.slice(0, 2).map((feature, index) => (
                  <span key={index} className="morandi-badge text-xs">
                    ✓ {feature}
                  </span>
                ))}
                {house.features.length > 2 && (
                  <span className="morandi-badge text-xs">
                    +{house.features.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 內容區域 */}
        <div className="p-6">
          <h3 className="text-xl font-bold morandi-text-primary mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
            {house.title}
          </h3>

          <div className="flex items-center gap-1 morandi-text-secondary mb-4">
            <span className="text-primary-500">📍</span>
            <span className="text-sm line-clamp-1">{house.address}</span>
          </div>

          {/* 房屋資訊 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold morandi-text-primary">
                {house.rooms}房{house.bathrooms}衛
              </div>
              <div className="text-xs morandi-text-muted">格局</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold morandi-text-primary">
                {house.area}坪
              </div>
              <div className="text-xs morandi-text-muted">坪數</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold morandi-text-primary">
                {house.floor}
              </div>
              <div className="text-xs morandi-text-muted">樓層</div>
            </div>
          </div>

          {/* 底部資訊 */}
          <div className="flex items-center justify-between pt-4 border-t border-background-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <span className="text-sm morandi-text-secondary">
                {new Date(house.postedDate).toLocaleDateString('zh-TW')}
              </span>
            </div>
            <div className="text-sm font-medium text-accent-600">
              單價{' '}
              {Math.round((house.price * 10000) / house.area).toLocaleString()}
              元/坪
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

interface HouseListProps {
  houses: House[]
  loading?: boolean
}

export default function HouseList({ houses, loading = false }: HouseListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="morandi-card overflow-hidden">
            <div className="h-64 bg-background-200 animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 bg-background-200 rounded animate-pulse mb-3"></div>
              <div className="h-4 bg-background-200 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="h-12 bg-background-200 rounded animate-pulse"></div>
                <div className="h-12 bg-background-200 rounded animate-pulse"></div>
                <div className="h-12 bg-background-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 bg-background-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (houses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="morandi-card max-w-md mx-auto p-12">
          <div className="text-6xl mb-6">🏠</div>
          <h3 className="text-2xl font-bold morandi-text-primary mb-3">
            沒有找到符合條件的房屋
          </h3>
          <p className="morandi-text-secondary mb-6">
            請調整搜尋條件或瀏覽其他房屋
          </p>
          <Link href="/publish" className="morandi-button-primary">
            免費刊登房屋
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {houses.map((house) => (
          <div key={house.id} className="morandi-fade-in">
            <HouseCard house={house} />
          </div>
        ))}
      </div>

      {/* 分頁或載入更多按鈕 */}
      {houses.length > 0 && (
        <div className="text-center mt-12">
          <p className="morandi-text-secondary mb-4">
            已顯示 {houses.length} 個物件
          </p>
          <div className="flex justify-center space-x-4">
            <button className="morandi-button-secondary">載入更多</button>
            <Link href="/publish" className="morandi-button-accent">
              ✨ 刊登您的房屋
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
