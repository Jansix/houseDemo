'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { House } from '@/types/house'
import { houseService } from '@/services/houseService'
import RelatedHouses from '@/components/RelatedHouses'
import PriceComparison from '@/components/PriceComparison'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

import dynamic from 'next/dynamic'
import { MyPDFDocument } from '@/components/MyPDFDocument'
import { PDFDownloadLink } from '@react-pdf/renderer'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

// Lightbox imports
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

// Custom styles
import './swiper-custom.css'

interface HouseDetailPageProps {
  params: {
    id: string
  }
}

export default function HouseDetailPage({ params }: HouseDetailPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [house, setHouse] = useState<House | null>(null)
  const [allHouses, setAllHouses] = useState<House[]>([])
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showCheckModal, setShowCheckModal] = useState(false)

  // 處理圖片 URL，確保是完整的 URL
  const getFullImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    return `https://house_demo.codychen.me${
      imageUrl.startsWith('/') ? '' : '/'
    }${imageUrl}`
  }

  useEffect(() => {
    const fetchHouseData = async () => {
      setLoading(true)
      try {
        // 從 API 獲取房屋詳情
        const houseData = await houseService.getHouseInfo(params.id)
        setHouse(houseData)
      } catch (error) {
        console.error('獲取房屋資料失敗:', error)
        setHouse(null)
        toast.error('無法載入房屋資訊，請稍後重試')
      } finally {
        setLoading(false)
      }
    }

    fetchHouseData()
  }, [params.id])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!house) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">🏠</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">找不到該物件</h1>
        <p className="text-gray-600 mb-6">
          {loading ? '載入中...' : '您要查看的房屋可能已下架或不存在'}
        </p>
        <Link
          href="/"
          className={`inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition duration-200`}
        >
          返回首頁
        </Link>
      </div>
    )
  }

  const typeMap: { [key: string]: string } = {
    apartment: '公寓',
    house: '透天厝',
    villa: '別墅',
    公寓: '公寓',
    透天厝: '透天厝',
    別墅: '別墅',
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const handleDeleteHouse = async () => {
    try {
      if (!house?.house_id) {
        toast.error('房屋資訊錯誤，無法刪除')
        return
      }

      const res = await houseService.deleteHouse(house.house_id)
      toast.success('房屋已成功刪除')

      // 刪除成功後跳轉回首頁
      router.push('/')
    } catch (error) {
      console.error('刪除房屋失敗:', error)
      toast.error('刪除房屋失敗，請稍後重試')
    } finally {
      setShowCheckModal(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 導航麵包屑 */}
      <div className="flex items-center justify-between mb-4">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            首頁
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-600">房屋</span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-600">{house.addr.split('市')[0]}市</span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-600">
            {house.addr.split('區')[0].split('市')[1]}區
          </span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-600">
            {typeMap[house.house_type] || house.house_type}
          </span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-600">
            {house.price < 1000
              ? `${house.price}萬以下`
              : house.price >= 1000 && house.price < 2000
              ? '1000-2000萬'
              : house.price >= 2000 && house.price < 3000
              ? '2000-3000萬'
              : house.price >= 3000 && house.price < 5000
              ? '3000-5000萬'
              : '5000萬以上'}
          </span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-primary-600">{house.title}</span>
        </nav>
        <div className="flex gap-3">
          <PDFDownloadLink
            document={<MyPDFDocument house={house} />}
            fileName={`${house.title}-房屋資料.pdf`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  生成中...
                </span>
              ) : (
                <span className="flex items-center">📄 下載PDF</span>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="main-content">
        {/* 左側：圖片和基本資訊 */}
        <div className="lg:col-span-2">
          {/* 圖片輪播 */}
          <div className="relative mb-6">
            {/* ...existing code... */}
            {/* 主要輪播 */}
            <div className="mb-4">
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                spaceBetween={10}
                navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper }}
                className="main-swiper aspect-video rounded-lg overflow-hidden"
              >
                {house.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="w-full h-full relative cursor-pointer bg-gray-100"
                      onClick={() => openLightbox(index)}
                    >
                      <img
                        src={getFullImageUrl(image)}
                        alt={`房屋圖片 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // 如果圖片載入失敗，隱藏圖片並顯示備用內容
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const container = target.parentElement
                          const fallback = container?.querySelector(
                            'div:last-child'
                          ) as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-lg font-medium">
                          點擊放大預覽
                        </span>
                      </div>
                      {/* 備用顯示 */}
                      <div
                        className="absolute inset-0 flex items-center justify-center text-gray-500 text-center"
                        style={{ display: 'none' }}
                      >
                        <div>
                          <span>
                            房屋圖片 {index + 1}/{house.images.length}
                          </span>
                          <br />
                          <span className="text-sm">點擊放大預覽</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* 縮圖輪播 */}
            {house.images.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[FreeMode, Thumbs]}
                spaceBetween={10}
                slidesPerView={4}
                slidesPerGroup={1}
                freeMode={true}
                watchSlidesProgress={true}
                breakpoints={{
                  320: {
                    slidesPerView: 3,
                  },
                  640: {
                    slidesPerView: 4,
                  },
                  768: {
                    slidesPerView: 5,
                  },
                  1024: {
                    slidesPerView: 6,
                  },
                }}
                className="thumbs-swiper"
              >
                {house.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full h-20 bg-gray-300 rounded cursor-pointer overflow-hidden relative">
                      <img
                        src={getFullImageUrl(image)}
                        alt={`縮圖 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // 如果圖片載入失敗，隱藏圖片並顯示序號
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const sibling =
                            target.nextElementSibling as HTMLElement
                          if (sibling) sibling.style.display = 'flex'
                        }}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center text-xs text-gray-600 bg-gray-300"
                        style={{ display: 'none' }}
                      >
                        {index + 1}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* 房屋標題和價格 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {house.title}
            </h1>

            {/* 價格顯示 */}
            <div className="mb-6">
              <PriceComparison
                currentPrice={house.price}
                previousPrice={house.previous_price}
                listingType={house.listing_type}
                variant="detailed"
                className="mb-4"
              />
              <div className="text-gray-600">
                {house.listing_type === '出租'
                  ? `${
                      house.parking_space === '無' ? '' : '含車位'
                    }租金｜每坪約${Math.round(house.price / house.area)}元/月`
                  : `${
                      house.parking_space === '無' ? '' : '含車位'
                    }價格｜單價約${Math.round(
                      (house.price * 10000) / house.area
                    )}元/坪`}
              </div>
            </div>

            {/* 房屋基本資訊 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">
                  {house.rooms}房{house.living_rooms}廳{house.bathrooms}衛
                </div>
                <div className="text-sm text-gray-600">格局</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">
                  {house.area}
                </div>
                <div className="text-sm text-gray-600">坪數</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">
                  {house.current_floor}/{house.total_floor}樓
                </div>
                <div className="text-sm text-gray-600">樓層</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">
                  {new Date().getFullYear() - new Date(house.age).getFullYear()}
                  年
                </div>
                <div className="text-sm text-gray-600">屋齡</div>
              </div>
            </div>

            {/* 特色標籤 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {house.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-200 text-white border border-primary-200"
                >
                  ✓ {feature}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>📍 {house.addr}</span>
              <span>
                刊登日期：
                {new Date(house.posted_date).toLocaleDateString('zh-TW')}
              </span>
            </div>
          </div>

          {/* 房屋詳細資訊表格 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">房屋資料</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">現況</span>
                <span className="font-medium">{house.current_status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">型態</span>
                <span className="font-medium">
                  {typeMap[house.house_type] || house.house_type}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">管理費</span>
                <span className="font-medium">
                  {house.management_fee > 0
                    ? `${house.management_fee}元/月`
                    : '無'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">車位</span>
                <span className="font-medium">{house.parking_space}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">裝潢程度</span>
                <span className="font-medium">{house.decoration}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">單位</span>
                <span className="font-medium">{house.unit}</span>
              </div>
            </div>
          </div>

          {/* 周邊機能 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">周邊機能</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">學區</h4>
                <p className="text-gray-700 text-sm mb-4">
                  {(house.schools ?? []).join('、')}
                </p>

                <h4 className="font-semibold text-gray-800 mb-3">熱門商圈</h4>
                <p className="text-gray-700 text-sm mb-4">
                  {(house.commercial_areas ?? []).join('、')}
                </p>

                <h4 className="font-semibold text-gray-800 mb-3">超商/賣場</h4>
                <p className="text-gray-700 text-sm mb-4">
                  {(house.stores ?? []).join('、')}
                </p>

                <h4 className="font-semibold text-gray-800 mb-3">傳統市場</h4>
                <p className="text-gray-700 text-sm">
                  {(house.markets ?? []).join('、')}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">醫療機構</h4>
                <p className="text-gray-700 text-sm mb-4">
                  {(house.medical ?? []).join('、')}
                </p>

                <h4 className="font-semibold text-gray-800 mb-3">政府機構</h4>
                <p className="text-gray-700 text-sm mb-4">
                  {(house.government ?? []).join('、')}
                </p>

                <h4 className="font-semibold text-gray-800 mb-3">其他配套</h4>
                <p className="text-gray-700 text-sm mb-4">
                  {(house.others ?? []).join('、')}
                </p>

                <h4 className="font-semibold text-gray-800 mb-3">公共建設</h4>
                <p className="text-gray-700 text-sm">
                  {(house.public_facilities ?? []).join('、')}
                </p>
              </div>
            </div>
          </div>

          {/* 特色標籤 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">物件特色</h2>
            <div className="flex flex-wrap gap-2">
              {house.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-block bg-primary-200 text-white px-3 py-2 rounded-lg text-sm font-medium"
                >
                  ✓ {feature}
                </span>
              ))}
            </div>
          </div>

          {/* 屋況特色 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">屋況特色</h2>
            <div className="text-gray-700 leading-relaxed">
              {house.description}
            </div>
          </div>

          {/* 房屋介紹 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">房屋介紹</h2>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: house.introduction }}
            />
          </div>
        </div>

        {/* 右側：聯絡資訊和操作 */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* 聯絡資訊 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <PriceComparison
                  currentPrice={house.price}
                  previousPrice={house.previous_price}
                  listingType={house.listing_type}
                  variant="default"
                  className="mb-3"
                />
                <div className="text-gray-600 text-sm">
                  {house.listing_type === '出租'
                    ? `${house.parking_space === '無' ? '' : '含車位'}租金`
                    : `${house.parking_space === '無' ? '' : '含車位'}價格`}
                </div>
                <div className="text-primary-500 font-medium">
                  {house.listing_type === '出租'
                    ? `每坪約${Math.round(house.price / house.area)}元/月`
                    : `單價約${Math.round(
                        (house.price * 10000) / house.area
                      )}元/坪`}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    {house.contact?.avatar ? (
                      <img
                        src={`https://house_demo.codychen.me${house.contact.avatar}`}
                        alt="聯絡人頭像"
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const fallback =
                            target.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <span
                      className="text-2xl"
                      style={{
                        display: house.contact?.avatar ? 'none' : 'inline',
                      }}
                    >
                      👤
                    </span>
                  </div>
                  {house.contact ? (
                    <>
                      <div className="font-medium text-gray-800">
                        {house.contact.name}
                      </div>
                      {/* <div className="text-sm text-gray-600">(屋主)</div> */}

                      {user &&
                        (user.username === house.contact.name ||
                          user.level === 'admin') && (
                          <div className="flex justify-center gap-2 mt-3">
                            <button
                              onClick={() =>
                                router.push(`/publish?edit=${house.house_id}`)
                              }
                              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition"
                            >
                              編輯
                            </button>
                            <button
                              onClick={() => setShowCheckModal(true)}
                              className="px-4 py-2 bg-white text-primary-700 rounded hover:bg-primary-200 transition border border-primary-300"
                            >
                              刪除
                            </button>
                          </div>
                        )}
                    </>
                  ) : (
                    <>
                      <div className="font-medium text-gray-800">房屋仲介</div>
                      <div className="text-sm text-gray-600">(專業代理)</div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  className="w-full bg-primary-500 text-white py-4 rounded-lg hover:bg-primary-600 transition duration-200 font-bold text-lg flex items-center justify-center gap-2"
                  onClick={() => {
                    if (house.contact?.phone) {
                      navigator.clipboard.writeText(house.contact.phone)
                      toast.success('已複製聯絡電話到剪貼簿')
                    }
                  }}
                >
                  {house.contact ? house.contact.phone : '聯絡電話'}
                </button>
                {house.contact?.phone ? (
                  <a
                    href={`tel:${house.contact.phone}`}
                    className="w-full block border-2 border-primary-500 text-primary-500 py-3 rounded-lg hover:bg-primary-50 transition duration-200 font-medium text-center"
                  >
                    {house.listing_type === '出租' ? '預約看房' : '預約看屋'}
                  </a>
                ) : (
                  <button
                    className="w-full border-2 border-primary-500 text-primary-500 py-3 rounded-lg hover:bg-primary-50 transition duration-200 font-medium"
                    disabled
                  >
                    {house.listing_type === '出租' ? '預約看房' : '預約看屋'}
                  </button>
                )}
                {/* <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition duration-200 font-medium">
                  收藏物件
                </button> */}
              </div>
            </div>

            {/* 計算工具 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {house.listing_type === '出租' ? '租屋試算' : '房貸試算'}
              </h3>

              {house.listing_type === '出租' ? (
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">月租金</span>
                    <span className="font-medium">{house.price}元</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">押金 (2個月)</span>
                    <span className="font-medium">
                      {(house.price * 2).toLocaleString()}元
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">年租金總額</span>
                    <span className="font-medium">
                      {(house.price * 12).toLocaleString()}元
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-600">每坪月租</span>
                    <span className="font-medium text-primary-600">
                      約 {Math.round(house.price / house.area)}元/坪
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">物件總價</span>
                    <span className="font-medium">{house.price}萬</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">頭期款 (30%)</span>
                    <span className="font-medium">
                      {Math.round(house.price * 0.3)}萬
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">貸款金額 (70%)</span>
                    <span className="font-medium">
                      {Math.round(house.price * 0.7)}萬
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-600">月付金額 (30年)</span>
                    <span className="font-medium text-primary-600">
                      約{' '}
                      {Math.round(
                        (house.price * 0.7 * 10000 * 0.02) / 12
                      ).toLocaleString()}
                      元
                    </span>
                  </div>
                </div>
              )}
              <a
                href={
                  house.listing_type === '出租'
                    ? 'https://rent.591.com.tw/tools/calculator'
                    : 'https://www.megabank.com.tw/personal/loan/mortgage-calculation'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition duration-200 text-sm block text-center"
              >
                詳細試算
              </a>
            </div>

            {/* 返回按鈕 */}
            <Link
              href="/"
              className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
            >
              ← 返回列表
            </Link>
          </div>
        </div>
      </div>

      {/* 相關推薦 */}
      {/* <div className="mt-8">
        <RelatedHouses currentHouse={house} allHouses={allHouses} />
      </div> */}

      {/* 圖片放大預覽 */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={house.images.map((image, index) => ({
          src: getFullImageUrl(image),
          alt: `房屋圖片 ${index + 1}`,
        }))}
      />

      {/* 刪除確認彈窗 */}
      {showCheckModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                確認刪除房屋
              </h3>
              <p className="text-gray-600 mb-6">
                您確定要刪除這個房屋嗎？
                <br />
                此操作無法復原，請確認後再進行。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  取消
                </button>
                <button
                  onClick={handleDeleteHouse}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  確認刪除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
