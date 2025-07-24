'use client'

// 簡化的價格歷史記錄介面，僅用於此組件
interface PriceHistoryItem {
  price: number
  date: string
  change_type?: 'increase' | 'decrease' | 'initial'
}

interface PriceTrendChartProps {
  priceHistory: PriceHistoryItem[]
  listingType: '販售' | '出租'
  className?: string
}

export default function PriceTrendChart({
  priceHistory,
  listingType,
  className = '',
}: PriceTrendChartProps) {
  if (!priceHistory || priceHistory.length < 2) {
    return null
  }

  // 計算價格範圍以正規化圖表
  const prices = priceHistory.map((h) => h.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice

  // 創建 SVG 路徑
  const createPath = () => {
    const width = 300
    const height = 80
    const padding = 10

    const points = priceHistory
      .map((history, index) => {
        const x =
          padding + (index * (width - 2 * padding)) / (priceHistory.length - 1)
        const normalizedPrice =
          priceRange > 0 ? (history.price - minPrice) / priceRange : 0.5
        const y = height - padding - normalizedPrice * (height - 2 * padding)
        return `${x},${y}`
      })
      .join(' ')

    return `M ${points.replace(/,/g, ' ').replace(/ /g, ' L ')}`
  }

  const unit = listingType === '出租' ? '元/月' : '萬元'

  return (
    <div
      className={`bg-white rounded-lg p-4 border border-gray-200 ${className}`}
    >
      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        📊 價格趨勢圖
        <span className="text-xs text-gray-500">
          ({priceHistory.length} 次記錄)
        </span>
      </h4>

      <div className="relative">
        {/* SVG 圖表 */}
        <svg width="100%" height="80" viewBox="0 0 300 80" className="w-full">
          {/* 網格線 */}
          <defs>
            <pattern
              id="grid"
              width="30"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 30 0 L 0 0 0 20"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* 價格線 */}
          <path
            d={createPath()}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 數據點 */}
          {priceHistory.map((history, index) => {
            const x = 10 + (index * 280) / (priceHistory.length - 1)
            const normalizedPrice =
              priceRange > 0 ? (history.price - minPrice) / priceRange : 0.5
            const y = 70 - normalizedPrice * 60

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={
                    history.change_type === 'decrease'
                      ? '#10b981'
                      : history.change_type === 'increase'
                      ? '#ef4444'
                      : '#6b7280'
                  }
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
                {/* 懸停提示 */}
                <title>
                  {new Date(history.date).toLocaleDateString('zh-TW')}:{' '}
                  {history.price.toLocaleString()}
                  {unit}
                </title>
              </g>
            )
          })}
        </svg>

        {/* 價格標籤 */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>
            {minPrice.toLocaleString()}
            {unit}
          </span>
          <span className="font-medium">
            最新：{priceHistory[priceHistory.length - 1].price.toLocaleString()}
            {unit}
          </span>
          <span>
            {maxPrice.toLocaleString()}
            {unit}
          </span>
        </div>

        {/* 日期範圍 */}
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>
            {new Date(priceHistory[0].date).toLocaleDateString('zh-TW')}
          </span>
          <span>
            {new Date(
              priceHistory[priceHistory.length - 1].date
            ).toLocaleDateString('zh-TW')}
          </span>
        </div>
      </div>
    </div>
  )
}
