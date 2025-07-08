'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { House } from '@/data/houses'
import { useTwCitySelector } from '@/hooks/useTwCitySelector'
import dynamic from 'next/dynamic'

// 動態載入富文本編輯器，避免 SSR 問題
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface PublishFormData {
  title: string
  price: number
  address: string
  city: string
  district: string
  area: number
  rooms: number
  bathrooms: number
  floor: string
  age: number
  type: 'apartment' | 'house' | 'villa'
  description: string
  introduction: string
  features: string[]
  currentStatus: string
  managementFee: number
  parkingSpace: boolean
  decoration: string
  contactName: string
  contactPhone: string
  // 新增周邊機能欄位
  nearbyFacilities: {
    schools: string
    commercialAreas: string
    stores: string
    markets: string
    medical: string
    government: string
    publicFacilities: string
    transportation: string
  }
}

export default function PublishPage() {
  const router = useRouter()
  const { cities, getDistricts } = useTwCitySelector()

  const [formData, setFormData] = useState<PublishFormData>({
    title: '',
    price: 0,
    address: '',
    city: '',
    district: '',
    area: 0,
    rooms: 1,
    bathrooms: 1,
    floor: '',
    age: 0,
    type: 'apartment',
    description: '',
    introduction: '',
    features: [],
    currentStatus: '住宅',
    managementFee: 0,
    parkingSpace: false,
    decoration: '簡單裝潢',
    contactName: '',
    contactPhone: '',
    nearbyFacilities: {
      schools: '',
      commercialAreas: '',
      stores: '',
      markets: '',
      medical: '',
      government: '',
      publicFacilities: '',
      transportation: '',
    },
  })

  const [imageBase64List, setImageBase64List] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 處理基本欄位變更
  const handleInputChange = (field: keyof PublishFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // 處理特色標籤
  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  // 將 File 轉換為 base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // 處理圖片上傳
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length + imageBase64List.length > 8) {
      alert('最多只能上傳 8 張圖片')
      return
    }

    try {
      // 將所有檔案轉換為 base64
      const base64Promises = files.map((file) => fileToBase64(file))
      const newBase64Images = await Promise.all(base64Promises)

      setImageBase64List((prev) => [...prev, ...newBase64Images])
    } catch (error) {
      console.error('圖片轉換失敗:', error)
      alert('圖片處理失敗，請重試')
    }
  }

  // 移除圖片
  const removeImage = (index: number) => {
    setImageBase64List((prev) => prev.filter((_, i) => i !== index))
  }

  // 提交表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 驗證必填欄位
      if (
        !formData.title ||
        !formData.city ||
        !formData.district ||
        !formData.address ||
        !formData.price ||
        !formData.area ||
        !formData.contactName ||
        !formData.contactPhone
      ) {
        alert('請填寫所有必填欄位')
        return
      }

      // 建立新房屋資料
      const newHouse: House = {
        id: Date.now().toString(), // 使用時間戳作為臨時 ID
        title: formData.title,
        price: formData.price, // 將萬元轉換為元
        address: `${formData.city}${formData.district}${formData.address}`,
        area: formData.area,
        rooms: formData.rooms,
        bathrooms: formData.bathrooms,
        floor: formData.floor,
        age: formData.age,
        type: formData.type,
        images: imageBase64List.length > 0 ? imageBase64List : ['/house1.png'], // 如果沒有上傳圖片，使用預設圖片
        description: formData.description,
        introduction: formData.introduction,
        postedDate: new Date().toISOString().split('T')[0],
        features: formData.features,
        houseDetails: {
          currentStatus: formData.currentStatus,
          managementFee: formData.managementFee,
          parkingSpace: formData.parkingSpace,
          decoration: formData.decoration,
          unit: formData.parkingSpace ? '整戶｜含車位' : '整戶｜無車位',
        },
        nearbyFacilities: {
          schools: formData.nearbyFacilities.schools
            ? formData.nearbyFacilities.schools
                .split('、')
                .filter((item) => item.trim())
            : [],
          commercialAreas: formData.nearbyFacilities.commercialAreas
            ? formData.nearbyFacilities.commercialAreas
                .split('、')
                .filter((item) => item.trim())
            : [],
          stores: formData.nearbyFacilities.stores
            ? formData.nearbyFacilities.stores
                .split('、')
                .filter((item) => item.trim())
            : [],
          markets: formData.nearbyFacilities.markets
            ? formData.nearbyFacilities.markets
                .split('、')
                .filter((item) => item.trim())
            : [],
          medical: formData.nearbyFacilities.medical
            ? formData.nearbyFacilities.medical
                .split('、')
                .filter((item) => item.trim())
            : [],
          government: formData.nearbyFacilities.government
            ? formData.nearbyFacilities.government
                .split('、')
                .filter((item) => item.trim())
            : [],
          others: formData.nearbyFacilities.transportation
            ? formData.nearbyFacilities.transportation
                .split('、')
                .filter((item) => item.trim())
            : [],
          publicFacilities: formData.nearbyFacilities.publicFacilities
            ? formData.nearbyFacilities.publicFacilities
                .split('、')
                .filter((item) => item.trim())
            : [],
        },
        contact: {
          name: formData.contactName,
          phone: formData.contactPhone,
        },
      }

      // 將新房屋資料暫存到 localStorage
      const existingHouses = JSON.parse(
        localStorage.getItem('newHouses') || '[]'
      )
      existingHouses.unshift(newHouse) // 新增到最前面
      localStorage.setItem('newHouses', JSON.stringify(existingHouses))

      alert('房屋刊登成功！')
      router.push('/')
    } catch (error) {
      alert('刊登失敗，請重試')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableFeatures = [
    '近捷運',
    '近車站',
    '電梯',
    '陽台',
    '已裝潢',
    '新裝潢',
    '豪華裝潢',
    '車位',
    '管理員',
    '花園',
    '頂樓',
    '河景',
    '山景',
    '學區',
    '商圈',
    '便利商店',
    '超市',
    '醫院',
    '公園',
    '安靜',
    '採光佳',
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">刊登房屋</h1>
        <p className="text-gray-600">填寫房屋資訊，讓更多人看到您的物件</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本資料 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">基本資料</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 房屋標題 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                房屋標題 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入房屋標題，例如：台北市大安區精美2房"
                required
              />
            </div>

            {/* 縣市 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                縣市 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => {
                  handleInputChange('city', e.target.value)
                  handleInputChange('district', '') // 重置區域
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">請選擇縣市</option>
                {cities.map((city: string) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* 區域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                區域 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={!formData.city}
                required
              >
                <option value="">請選擇區域</option>
                {formData.city &&
                  getDistricts(formData.city).map((district: string) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>
            </div>

            {/* 詳細地址 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                詳細地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入路名及門牌號碼"
                required
              />
            </div>

            {/* 售價 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                售價 (萬元) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) =>
                  handleInputChange('price', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入售價"
                min="1"
                required
              />
            </div>

            {/* 坪數 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                坪數 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.area || ''}
                onChange={(e) =>
                  handleInputChange('area', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入坪數"
                min="1"
                required
              />
            </div>

            {/* 房間數 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                房間數
              </label>
              <select
                value={formData.rooms}
                onChange={(e) =>
                  handleInputChange('rooms', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}房
                  </option>
                ))}
              </select>
            </div>

            {/* 衛浴數 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                衛浴數
              </label>
              <select
                value={formData.bathrooms}
                onChange={(e) =>
                  handleInputChange('bathrooms', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num}衛
                  </option>
                ))}
              </select>
            </div>

            {/* 樓層 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                樓層
              </label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => handleInputChange('floor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：5/12"
              />
            </div>

            {/* 屋齡 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                屋齡 (年)
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) =>
                  handleInputChange('age', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入屋齡"
                min="0"
              />
            </div>

            {/* 物件類型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                物件類型
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  handleInputChange(
                    'type',
                    e.target.value as 'apartment' | 'house' | 'villa'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="apartment">公寓</option>
                <option value="house">透天厝</option>
                <option value="villa">別墅</option>
              </select>
            </div>

            {/* 管理費 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理費 (元/月)
              </label>
              <input
                type="number"
                value={
                  formData.managementFee === 0
                    ? '0'
                    : formData.managementFee || ''
                }
                onChange={(e) =>
                  handleInputChange(
                    'managementFee',
                    Number(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="無管理費請填 0"
                min="0"
              />
            </div>

            {/* 是否有車位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                車位
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="parkingSpace"
                    checked={formData.parkingSpace}
                    onChange={() => handleInputChange('parkingSpace', true)}
                    className="mr-2"
                  />
                  有車位
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="parkingSpace"
                    checked={!formData.parkingSpace}
                    onChange={() => handleInputChange('parkingSpace', false)}
                    className="mr-2"
                  />
                  無車位
                </label>
              </div>
            </div>

            {/* 裝潢程度 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                裝潢程度
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  '簡單裝潢',
                  '精裝裝潢',
                  '新裝潢',
                  '豪華裝潢',
                  '頂級豪華裝潢',
                ].map((decoration) => (
                  <label key={decoration} className="flex items-center">
                    <input
                      type="radio"
                      name="decoration"
                      value={decoration}
                      checked={formData.decoration === decoration}
                      onChange={() =>
                        handleInputChange('decoration', decoration)
                      }
                      className="mr-2"
                    />
                    {decoration}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 房屋特色 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">房屋特色</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {availableFeatures.map((feature) => (
              <label key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="mr-2"
                />
                <span className="text-sm">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 周邊機能 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">周邊機能</h2>
          <p className="text-sm text-gray-600 mb-4">
            請用「、」分隔多個項目，例如：台大醫院、榮總醫院
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 學區 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                學區
              </label>
              <input
                type="text"
                value={formData.nearbyFacilities.schools}
                onChange={(e) =>
                  handleInputChange('nearbyFacilities', {
                    ...formData.nearbyFacilities,
                    schools: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：大安國小、龍門國中"
              />
            </div>

            {/* 商圈 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                熱門商圈
              </label>
              <input
                type="text"
                value={formData.nearbyFacilities.commercialAreas}
                onChange={(e) =>
                  handleInputChange('nearbyFacilities', {
                    ...formData.nearbyFacilities,
                    commercialAreas: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：信義商圈、東區商圈"
              />
            </div>

            {/* 超商/賣場 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                超商/賣場
              </label>
              <input
                type="text"
                value={formData.nearbyFacilities.stores}
                onChange={(e) =>
                  handleInputChange('nearbyFacilities', {
                    ...formData.nearbyFacilities,
                    stores: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：7-11、全聯、家樂福"
              />
            </div>

            {/* 傳統市場 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                傳統市場
              </label>
              <input
                type="text"
                value={formData.nearbyFacilities.markets}
                onChange={(e) =>
                  handleInputChange('nearbyFacilities', {
                    ...formData.nearbyFacilities,
                    markets: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：南門市場、建國市場"
              />
            </div>

            {/* 醫療機構 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                醫療機構
              </label>
              <input
                type="text"
                value={formData.nearbyFacilities.medical}
                onChange={(e) =>
                  handleInputChange('nearbyFacilities', {
                    ...formData.nearbyFacilities,
                    medical: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：台大醫院、榮總醫院"
              />
            </div>

            {/* 交通/其他 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                交通/其他設施
              </label>
              <input
                type="text"
                value={formData.nearbyFacilities.transportation}
                onChange={(e) =>
                  handleInputChange('nearbyFacilities', {
                    ...formData.nearbyFacilities,
                    transportation: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：捷運站、公車站、公園"
              />
            </div>

            {/* 政府機構 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                政府機構
              </label>
              <input
                type="text"
                value={formData.nearbyFacilities.government}
                onChange={(e) =>
                  handleInputChange('nearbyFacilities', {
                    ...formData.nearbyFacilities,
                    government: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：區公所、戶政事務所"
              />
            </div>

            {/* 公共建設 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公共建設
              </label>
              <input
                type="text"
                value={formData.nearbyFacilities.publicFacilities}
                onChange={(e) =>
                  handleInputChange('nearbyFacilities', {
                    ...formData.nearbyFacilities,
                    publicFacilities: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：圖書館、運動中心、公園"
              />
            </div>
          </div>
        </div>

        {/* 房屋描述 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">房屋描述</h2>

          <div className="space-y-6">
            {/* 簡短描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                簡短描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="請簡短描述房屋特色，約 50-100 字"
                required
              />
            </div>

            {/* 詳細介紹 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                詳細介紹
              </label>
              <div className="border border-gray-300 rounded-lg">
                <ReactQuill
                  value={formData.introduction}
                  onChange={(value: string) =>
                    handleInputChange('introduction', value)
                  }
                  style={{ minHeight: '200px' }}
                  placeholder="請詳細介紹房屋特色、周邊環境、交通便利性等..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* 房屋照片 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">房屋照片</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上傳照片 (最多 8 張)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">支援 JPG、PNG 格式</p>
            </div>

            {/* 圖片預覽 */}
            {imageBase64List.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageBase64List.map((base64: string, index: number) => (
                  <div key={index} className="relative">
                    <img
                      src={base64}
                      alt={`預覽 ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 聯絡資訊 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">聯絡資訊</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡人姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) =>
                  handleInputChange('contactName', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入聯絡人姓名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡電話 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) =>
                  handleInputChange('contactPhone', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入聯絡電話"
                required
              />
            </div>
          </div>
        </div>

        {/* 提交按鈕 */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            取消
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '刊登中...' : '確認刊登'}
          </button>
        </div>
      </form>
    </div>
  )
}
