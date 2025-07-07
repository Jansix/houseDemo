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
  images: File[]
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
    images: [],
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

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
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

  // 處理圖片上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length + formData.images.length > 8) {
      alert('最多只能上傳 8 張圖片')
      return
    }

    // 建立預覽 URL
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))

    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
  }

  // 移除圖片
  const removeImage = (index: number) => {
    // 釋放 URL 記憶體
    URL.revokeObjectURL(imagePreviewUrls[index])

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))

    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
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
        price: formData.price * 10000, // 將萬元轉換為元
        address: `${formData.city}${formData.district}${formData.address}`,
        area: formData.area,
        rooms: formData.rooms,
        bathrooms: formData.bathrooms,
        floor: formData.floor,
        age: formData.age,
        type: formData.type,
        images:
          imagePreviewUrls.length > 0 ? imagePreviewUrls : ['/house1.png'], // 如果沒有上傳圖片，使用預設圖片
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
    <div className="min-h-screen morandi-gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 頁面標題 */}
        <div className="mb-12 text-center morandi-fade-in">
          <h1 className="text-4xl font-bold morandi-text-primary mb-4">
            刊登您的房屋
          </h1>
          <p className="text-lg morandi-text-secondary max-w-2xl mx-auto">
            填寫詳細資訊，讓您的物件被更多人看見
          </p>
          <div className="mt-6 w-24 h-1 bg-accent-400 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 基本資料 */}
          <div className="morandi-card p-8 morandi-fade-in">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-primary-600 text-xl font-bold">1</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold morandi-text-primary">
                  基本資料
                </h2>
                <p className="morandi-text-secondary">填寫房屋的基本資訊</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 房屋標題 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  房屋標題 <span className="text-accent-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="morandi-input"
                  placeholder="請輸入房屋標題，例如：台北市大安區精美2房"
                  required
                />
              </div>

              {/* 縣市 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  縣市 <span className="text-accent-500">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => {
                    handleInputChange('city', e.target.value)
                    handleInputChange('district', '') // 重置區域
                  }}
                  className="morandi-input"
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
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  區域 <span className="text-accent-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    handleInputChange('district', e.target.value)
                  }
                  className="morandi-input disabled:opacity-50 disabled:cursor-not-allowed"
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
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  詳細地址 <span className="text-accent-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="morandi-input"
                  placeholder="請輸入路名及門牌號碼"
                  required
                />
              </div>

              {/* 售價 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  售價 (萬元) <span className="text-accent-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) =>
                    handleInputChange('price', Number(e.target.value))
                  }
                  className="morandi-input"
                  placeholder="請輸入售價"
                  min="1"
                  required
                />
              </div>

              {/* 坪數 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  坪數 <span className="text-accent-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.area || ''}
                  onChange={(e) =>
                    handleInputChange('area', Number(e.target.value))
                  }
                  className="morandi-input"
                  placeholder="請輸入坪數"
                  min="1"
                  required
                />
              </div>

              {/* 房間數 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  房間數
                </label>
                <select
                  value={formData.rooms}
                  onChange={(e) =>
                    handleInputChange('rooms', Number(e.target.value))
                  }
                  className="morandi-input"
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
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  衛浴數
                </label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) =>
                    handleInputChange('bathrooms', Number(e.target.value))
                  }
                  className="morandi-input"
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
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  樓層
                </label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  className="morandi-input"
                  placeholder="例如：5/12"
                />
              </div>

              {/* 屋齡 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  屋齡 (年)
                </label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) =>
                    handleInputChange('age', Number(e.target.value))
                  }
                  className="morandi-input"
                  placeholder="請輸入屋齡"
                  min="0"
                />
              </div>

              {/* 物件類型 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
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
                  className="morandi-input"
                >
                  <option value="apartment">公寓</option>
                  <option value="house">透天厝</option>
                  <option value="villa">別墅</option>
                </select>
              </div>

              {/* 管理費 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
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
                  className="morandi-input"
                  placeholder="無管理費請填 0"
                  min="0"
                />
              </div>

              {/* 是否有車位 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  車位
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="parkingSpace"
                      checked={formData.parkingSpace}
                      onChange={() => handleInputChange('parkingSpace', true)}
                      className="mr-3 w-4 h-4 text-primary-500 border-background-400 focus:ring-primary-300"
                    />
                    <span className="morandi-text-primary">有車位</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="parkingSpace"
                      checked={!formData.parkingSpace}
                      onChange={() => handleInputChange('parkingSpace', false)}
                      className="mr-3 w-4 h-4 text-primary-500 border-background-400 focus:ring-primary-300"
                    />
                    <span className="morandi-text-primary">無車位</span>
                  </label>
                </div>
              </div>

              {/* 裝潢程度 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold morandi-text-primary mb-4">
                  裝潢程度
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    '簡單裝潢',
                    '精裝裝潢',
                    '新裝潢',
                    '豪華裝潢',
                    '頂級豪華裝潢',
                  ].map((decoration) => (
                    <label
                      key={decoration}
                      className="flex items-center cursor-pointer p-3 rounded-xl border border-background-300 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
                    >
                      <input
                        type="radio"
                        name="decoration"
                        value={decoration}
                        checked={formData.decoration === decoration}
                        onChange={() =>
                          handleInputChange('decoration', decoration)
                        }
                        className="mr-3 w-4 h-4 text-primary-500 border-background-400 focus:ring-primary-300"
                      />
                      <span className="text-sm morandi-text-primary">
                        {decoration}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 房屋特色 */}
          <div className="morandi-card p-8 morandi-fade-in">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-secondary-600 text-xl font-bold">2</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold morandi-text-primary">
                  房屋特色
                </h2>
                <p className="morandi-text-secondary">
                  選擇符合您房屋的特色標籤
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableFeatures.map((feature) => (
                <label
                  key={feature}
                  className={`flex items-center cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.features.includes(feature)
                      ? 'border-primary-400 bg-primary-50/60 text-primary-700'
                      : 'border-background-300 hover:border-primary-200 hover:bg-primary-50/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="mr-3 w-4 h-4 text-primary-500 border-background-400 rounded focus:ring-primary-300"
                  />
                  <span className="text-sm font-medium">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 周邊機能 */}
          <div className="morandi-card p-8 morandi-fade-in">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-accent-600 text-xl font-bold">3</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold morandi-text-primary">
                  周邊機能
                </h2>
                <p className="morandi-text-secondary">
                  用「、」分隔多個項目，例如：台大醫院、榮總醫院
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 學區 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
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
                  className="morandi-input"
                  placeholder="例如：大安國小、龍門國中"
                />
              </div>

              {/* 商圈 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
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
                  className="morandi-input"
                  placeholder="例如：信義商圈、東區商圈"
                />
              </div>

              {/* 超商/賣場 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
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
                  className="morandi-input"
                  placeholder="例如：7-11、全聯、家樂福"
                />
              </div>

              {/* 傳統市場 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
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
                  className="morandi-input"
                  placeholder="例如：南門市場、建國市場"
                />
              </div>

              {/* 醫療機構 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
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
                  className="morandi-input"
                  placeholder="例如：台大醫院、榮總醫院"
                />
              </div>

              {/* 交通/其他 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
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
                  className="morandi-input"
                  placeholder="例如：捷運站、公車站、公園"
                />
              </div>

              {/* 政府機構 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
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
                  className="morandi-input"
                  placeholder="例如：區公所、戶政事務所"
                />
              </div>

              {/* 公共建設 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
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
                  className="morandi-input"
                  placeholder="例如：圖書館、運動中心、公園"
                />
              </div>
            </div>
          </div>

          {/* 房屋描述 */}
          <div className="morandi-card p-8 morandi-fade-in">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-primary-600 text-xl font-bold">4</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold morandi-text-primary">
                  房屋描述
                </h2>
                <p className="morandi-text-secondary">詳細介紹您的房屋特色</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* 簡短描述 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  簡短描述 <span className="text-accent-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  className="morandi-input resize-none"
                  rows={4}
                  placeholder="請簡短描述房屋特色，約 50-100 字"
                  required
                />
              </div>

              {/* 詳細介紹 */}
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  詳細介紹
                </label>
                <div className="border-2 border-background-300/40 rounded-xl overflow-hidden bg-white/80">
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
          <div className="morandi-card p-8 morandi-fade-in">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-secondary-600 text-xl font-bold">5</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold morandi-text-primary">
                  房屋照片
                </h2>
                <p className="morandi-text-secondary">
                  上傳房屋照片讓買家更了解您的物件
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  上傳照片 (最多 8 張)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="morandi-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p className="text-sm morandi-text-muted mt-2">
                    支援 JPG、PNG 格式，每張最大 5MB
                  </p>
                </div>
              </div>

              {/* 圖片預覽 */}
              {imagePreviewUrls.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold morandi-text-primary mb-4">
                    圖片預覽
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-background-100 border-2 border-background-300/40">
                          <img
                            src={url}
                            alt={`預覽 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-accent-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-accent-600 shadow-soft transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 聯絡資訊 */}
          <div className="morandi-card p-8 morandi-fade-in">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-accent-600 text-xl font-bold">6</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold morandi-text-primary">
                  聯絡資訊
                </h2>
                <p className="morandi-text-secondary">讓買家能夠聯繫到您</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  聯絡人姓名 <span className="text-accent-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) =>
                    handleInputChange('contactName', e.target.value)
                  }
                  className="morandi-input"
                  placeholder="請輸入聯絡人姓名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold morandi-text-primary mb-3">
                  聯絡電話 <span className="text-accent-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange('contactPhone', e.target.value)
                  }
                  className="morandi-input"
                  placeholder="請輸入聯絡電話"
                  required
                />
              </div>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="flex items-center justify-between pt-8 morandi-fade-in">
            <Link href="/" className="morandi-button-secondary">
              ← 取消返回
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="morandi-button-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  <span>刊登中...</span>
                </>
              ) : (
                <span>✓ 確認刊登</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
