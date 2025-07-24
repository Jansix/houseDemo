'use client'

interface PriceComparisonProps {
  currentPrice: number
  previousPrice?: number
  listingType: '販售' | '出租'
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

export default function PriceComparison({
  currentPrice,
  previousPrice,
  listingType,
  variant = 'default',
  className = '',
}: PriceComparisonProps) {
  // 計算價格變化
  const getPriceChange = () => {
    if (!previousPrice || previousPrice === currentPrice) return null

    const difference = currentPrice - previousPrice
    const percentage = ((difference / previousPrice) * 100).toFixed(1)
    const isDecrease = difference < 0

    return {
      difference: Math.abs(difference),
      percentage: Math.abs(parseFloat(percentage)),
      isDecrease,
      isIncrease: !isDecrease,
    }
  }

  const priceChange = getPriceChange()
  const unit = listingType === '出租' ? '元/月' : '萬元'
  const hasChange = !!priceChange

  // 緊湊版本（用於卡片）
  if (variant === 'compact') {
    return (
      <div className={`flex flex-col items-end gap-1 ${className}`}>
        <div className="bg-primary-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
          {currentPrice.toLocaleString()}
          {unit}
        </div>
        {priceChange && (
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shadow-md transform transition-all duration-200 hover:scale-105 ${
              priceChange.isDecrease
                ? 'bg-emerald-500 text-white animate-pulse'
                : 'bg-red-500 text-white animate-pulse'
            }`}
          >
            <span className="text-sm">
              {priceChange.isDecrease ? '📉' : '📈'}
            </span>
            {priceChange.percentage}%
          </div>
        )}
      </div>
    )
  }

  // 詳細版本（用於詳情頁）
  if (variant === 'detailed') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-4 mb-3">
          <div className="text-4xl font-bold text-primary-500">
            {currentPrice.toLocaleString()}
            <span className="text-lg text-gray-600 ml-2">{unit}</span>
          </div>

          {priceChange && (
            <div className="flex flex-col items-start">
              {/* 原價 */}
              <div className="text-lg text-gray-400 line-through">
                原價 {previousPrice?.toLocaleString()}
                {unit}
              </div>

              {/* 變化標籤 */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transform transition-all duration-300 hover:scale-105 ${
                  priceChange.isDecrease
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                }`}
              >
                <span className="text-lg">
                  {priceChange.isDecrease ? '📉' : '📈'}
                </span>
                <div className="flex flex-col">
                  <span>
                    {priceChange.isDecrease ? '降價' : '漲價'}{' '}
                    {priceChange.difference.toLocaleString()}
                    {listingType === '出租' ? '元' : '萬'}
                  </span>
                  <span className="text-xs opacity-90">
                    相比上次變動 {priceChange.percentage}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 默認版本（用於右側邊欄）
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center gap-3 ${
          hasChange ? '' : 'justify-center'
        }`}
      >
        <div className="text-2xl font-bold text-primary-500">
          {currentPrice.toLocaleString()}
          {unit}
        </div>

        {priceChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 line-through">
              原價 {previousPrice?.toLocaleString()}
              {unit}
            </span>
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${
                priceChange.isDecrease
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {priceChange.isDecrease ? '降價' : '漲價'}{' '}
              {priceChange.percentage}%
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
