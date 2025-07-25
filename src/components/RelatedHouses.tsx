'use client'

import Link from 'next/link'
import { House } from '@/types/house'

interface RelatedHousesProps {
  currentHouse: House
  allHouses: House[]
}

export default function RelatedHouses({
  currentHouse,
  allHouses,
}: RelatedHousesProps) {
  // 找相關房屋：同城市、相似價格範圍或同類型
  const relatedHouses = allHouses
    .filter((house) => house.house_id !== currentHouse.house_id)
    .filter((house) => {
      const sameCity = house.addr.includes(
        currentHouse.addr.split('市')[0] + '市'
      )
      const similarPrice =
        Math.abs(house.price - currentHouse.price) <= currentHouse.price * 0.3
      const sameType = house.house_type === currentHouse.house_type

      return sameCity || similarPrice || sameType
    })
    .slice(0, 3)

  if (relatedHouses.length === 0) {
    return null
  }

  const typeMap: { [key: string]: string } = {
    apartment: '公寓',
    house: '透天厝',
    villa: '別墅',
    公寓: '公寓',
    透天厝: '透天厝',
    別墅: '別墅',
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">相關推薦</h2>

      <div className="space-y-4">
        {relatedHouses.map((house) => (
          <Link
            key={house.house_id}
            href={`/houses/${house.house_id}`}
            className="block"
          >
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800 line-clamp-1">
                  {house.title}
                </h3>
                <span className="text-primary-600 font-bold text-lg">
                  {house.price}
                  {house.listing_type === '出租' ? '元/月' : '萬'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2">📍 {house.addr}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {house.rooms}房{house.bathrooms}衛・{house.area}坪
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {typeMap[house.house_type] || house.house_type}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          查看更多物件 →
        </Link>
      </div>
    </div>
  )
}
