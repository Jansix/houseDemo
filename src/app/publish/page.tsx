'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTwCitySelector } from '@/hooks/useTwCitySelector'
import dynamic from 'next/dynamic'
import config from '@/data/config'
import TagsInput from 'react-tagsinput'
import { PublishFormData } from '@/types/house'
import { houseService } from '@/services/houseService'

// 動態載入富文本編輯器，避免 SSR 問題
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import 'react-tagsinput/react-tagsinput.css'
import './tag-input.css'

export default function PublishPage() {
  const router = useRouter()
  const { cities, getDistricts } = useTwCitySelector()

  const [formData, setFormData] = useState<PublishFormData>({
    title: '',
    price: 0,
    addr: '',
    area: 0,
    rooms: 1,
    living_rooms: 0,
    bathrooms: 1,
    total_floor: '',
    current_floor: '',
    age: '',
    house_type: '公寓',
    listing_type: '販售',
    description: '',
    introduction: '',
    features: [],
    current_status: '住宅',
    management_fee: 0,
    parking_space: '無',
    decoration: '簡單裝潢',
    unit: '公寓',
    schools: [],
    commercial_areas: [],
    stores: [],
    markets: [],
    medical: [],
    government: [],
    others: [],
    public_facilities: [],
    imagesBase64: [], // Base64 格式的圖片列表
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

  // 處理標籤變更（react-tagsinput 的 API）
  const handleTagsChange = (
    field: keyof Pick<
      PublishFormData,
      | 'schools'
      | 'commercial_areas'
      | 'stores'
      | 'markets'
      | 'medical'
      | 'government'
      | 'others'
      | 'public_facilities'
    >,
    tags: string[]
  ) => {
    handleInputChange(field, tags)
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

      // 更新兩個狀態，保持同步
      setImageBase64List((prev) => [...prev, ...newBase64Images])
      setFormData((prev) => ({
        ...prev,
        imagesBase64: [...(prev.imagesBase64 || []), ...newBase64Images],
      }))
    } catch (error) {
      console.error('圖片轉換失敗:', error)
      alert('圖片處理失敗，請重試')
    }
  }

  // 移除圖片
  const removeImage = (index: number) => {
    setImageBase64List((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      imagesBase64: (prev.imagesBase64 || []).filter((_, i) => i !== index),
    }))
  }

  // 提交表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 驗證必填欄位
      if (
        !formData.title ||
        !formData.addr ||
        !formData.price ||
        !formData.area ||
        !formData.rooms ||
        !formData.bathrooms ||
        !formData.total_floor ||
        !formData.age ||
        !formData.description ||
        !formData.introduction
      ) {
        alert('請填寫所有必填欄位')
        return
      }

      // 準備 FormData
      const apiFormData = new FormData()

      // 基本欄位
      // 將所有基本欄位和需要逗號分隔的陣列欄位添加到 FormData 中
      apiFormData.append('title', formData.title)
      apiFormData.append('price', formData.price.toString())
      apiFormData.append('addr', formData.addr)
      apiFormData.append('area', formData.area.toString())
      apiFormData.append('rooms', formData.rooms.toString())
      apiFormData.append('living_rooms', formData.living_rooms.toString())
      apiFormData.append('bathrooms', formData.bathrooms.toString())
      apiFormData.append('total_floor', formData.total_floor)
      apiFormData.append('current_floor', formData.current_floor || '0')
      apiFormData.append('age', formData.age)
      apiFormData.append('house_type', formData.house_type)
      apiFormData.append('listing_type', formData.listing_type)
      apiFormData.append('description', formData.description)
      apiFormData.append('introduction', formData.introduction)

      // *** 這裡修改：將 features 陣列轉換為逗號分隔的字串 ***
      apiFormData.append('features', formData.features.join(','))

      apiFormData.append('current_status', formData.current_status)
      apiFormData.append('management_fee', formData.management_fee.toString())
      apiFormData.append('parking_space', formData.parking_space)
      apiFormData.append('decoration', formData.decoration)
      apiFormData.append('unit', formData.unit)

      // *** 這裡修改：所有周邊設施陣列也轉換為逗號分隔的字串 ***
      // 只有當陣列有值時才 append，避免傳送空字串
      if (formData.schools.length > 0)
        apiFormData.append('schools', formData.schools.join(','))
      if (formData.commercial_areas.length > 0)
        apiFormData.append(
          'commercial_areas',
          formData.commercial_areas.join(',')
        )
      if (formData.stores.length > 0)
        apiFormData.append('stores', formData.stores.join(','))
      if (formData.markets.length > 0)
        apiFormData.append('markets', formData.markets.join(','))
      if (formData.medical.length > 0)
        apiFormData.append('medical', formData.medical.join(','))
      if (formData.government.length > 0)
        apiFormData.append('government', formData.government.join(','))
      if (formData.others.length > 0)
        apiFormData.append('others', formData.others.join(','))
      if (formData.public_facilities.length > 0) {
        apiFormData.append(
          'public_facilities',
          formData.public_facilities.join(',')
        )
      }

      // 圖片上傳 - 使用 imageBase64List 而不是 formData.imagesBase64
      imageBase64List.forEach((base64, index) => {
        if (base64.includes(',')) {
          const byteString = atob(base64.split(',')[1])
          const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }
          const blob = new Blob([ab], { type: mimeString })
          // 使用後端期望的參數名稱 'images'
          apiFormData.append(
            'images',
            blob,
            `image_${index}.${mimeString.split('/')[1] || 'jpg'}`
          )
        }
      })

      // 詳細顯示表單數據 - 分別顯示原始 formData 和 FormData
      console.log('=== 原始表單數據 ===')
      console.log('formData:', formData)
      console.log('=== 圖片狀態 ===')
      console.log('imageBase64List 長度:', imageBase64List.length)
      console.log(
        'formData.imagesBase64 長度:',
        formData.imagesBase64?.length || 0
      )

      // 發送 API 請求
      const response = await houseService.addHouse(apiFormData)

      if (response.house_id) {
        alert('房屋刊登成功！')
        router.push('/')
      } else {
        throw new Error('API 請求失敗')
      }
    } catch (error) {
      console.error('刊登失敗:', error)
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

            {/* 地址 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.addr}
                onChange={(e) => handleInputChange('addr', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入完整地址，例如：台北市大安區忠孝東路四段"
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
                房間數 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.rooms || ''}
                onChange={(e) =>
                  handleInputChange('rooms', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入房間數"
                min="1"
                required
              />
            </div>

            {/* 廳數 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                廳數
              </label>
              <input
                type="number"
                value={formData.living_rooms || ''}
                onChange={(e) =>
                  handleInputChange('living_rooms', Number(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入廳數"
                min="0"
              />
            </div>

            {/* 衛浴數 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                衛浴數 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.bathrooms || ''}
                onChange={(e) =>
                  handleInputChange('bathrooms', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入衛浴數"
                min="1"
                required
              />
            </div>

            {/* 總樓層 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                總樓層 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.total_floor}
                onChange={(e) =>
                  handleInputChange('total_floor', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入總樓層數"
                min="1"
                required
              />
            </div>

            {/* 當前樓層 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                當前樓層
              </label>
              <input
                type="number"
                value={formData.current_floor}
                onChange={(e) =>
                  handleInputChange('current_floor', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="請輸入當前樓層（獨棟請填0）"
                min="0"
              />
            </div>

            {/* 建造日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                建造日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* 物件類型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                物件類型 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.house_type}
                onChange={(e) =>
                  handleInputChange(
                    'house_type',
                    e.target.value as '公寓' | '透天' | '別墅'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="公寓">公寓</option>
                <option value="透天">透天</option>
                <option value="別墅">別墅</option>
              </select>
            </div>

            {/* 刊登類型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                刊登類型 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.listing_type}
                onChange={(e) =>
                  handleInputChange(
                    'listing_type',
                    e.target.value as '販售' | '出租'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="販售">販售</option>
                <option value="出租">出租</option>
              </select>
            </div>

            {/* 現況 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                現況 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.current_status}
                onChange={(e) =>
                  handleInputChange(
                    'current_status',
                    e.target.value as '辦公室' | '住宅' | '工廠' | '混合用途'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="住宅">住宅</option>
                <option value="辦公室">辦公室</option>
                <option value="工廠">工廠</option>
                <option value="混合用途">混合用途</option>
              </select>
            </div>

            {/* 管理費 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理費 (元/月)
              </label>
              <input
                type="number"
                value={formData.management_fee || ''}
                onChange={(e) =>
                  handleInputChange(
                    'management_fee',
                    Number(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="無管理費請填 0"
                min="0"
              />
            </div>

            {/* 車位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                車位 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.parking_space}
                onChange={(e) =>
                  handleInputChange(
                    'parking_space',
                    e.target.value as '平面式' | '機械式' | '無'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="無">無</option>
                <option value="平面式">平面式</option>
                <option value="機械式">機械式</option>
              </select>
            </div>

            {/* 裝潢程度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                裝潢程度 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.decoration}
                onChange={(e) =>
                  handleInputChange(
                    'decoration',
                    e.target.value as
                      | '簡單裝潢'
                      | '精裝裝潢'
                      | '新裝潢'
                      | '豪華裝潢'
                      | '頂級豪華裝潢'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="簡單裝潢">簡單裝潢</option>
                <option value="精裝裝潢">精裝裝潢</option>
                <option value="新裝潢">新裝潢</option>
                <option value="豪華裝潢">豪華裝潢</option>
                <option value="頂級豪華裝潢">頂級豪華裝潢</option>
              </select>
            </div>

            {/* 單位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                單位 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  handleInputChange(
                    'unit',
                    e.target.value as '公寓' | '社區' | '華夏' | '獨棟'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="公寓">公寓</option>
                <option value="社區">社區</option>
                <option value="華夏">華夏</option>
                <option value="獨棟">獨棟</option>
              </select>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 學校 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                學校
              </label>
              <TagsInput
                value={formData.schools}
                onChange={(tags) => handleTagsChange('schools', tags)}
                inputProps={{
                  placeholder: '輸入學校名稱後按 Enter 新增標籤',
                  className: 'react-tagsinput-input',
                }}
                addKeys={[13, 188]} // Enter 和 comma
              />
            </div>

            {/* 商業區域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商業區域
              </label>
              <TagsInput
                value={formData.commercial_areas}
                onChange={(tags) => handleTagsChange('commercial_areas', tags)}
                inputProps={{
                  placeholder: '輸入商業區域後按 Enter 新增標籤',
                  className: 'react-tagsinput-input',
                }}
                addKeys={[13, 188]} // Enter 和 comma
              />
            </div>

            {/* 商店 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商店
              </label>
              <TagsInput
                value={formData.stores}
                onChange={(tags) => handleTagsChange('stores', tags)}
                inputProps={{
                  placeholder: '輸入商店名稱後按 Enter 新增標籤',
                  className: 'react-tagsinput-input',
                }}
                addKeys={[13, 188]} // Enter 和 comma
              />
            </div>

            {/* 市場 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                市場
              </label>
              <TagsInput
                value={formData.markets}
                onChange={(tags) => handleTagsChange('markets', tags)}
                inputProps={{
                  placeholder: '輸入市場名稱後按 Enter 新增標籤',
                  className: 'react-tagsinput-input',
                }}
                addKeys={[13, 188]} // Enter 和 comma
              />
            </div>

            {/* 醫療機構 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                醫療機構
              </label>
              <TagsInput
                value={formData.medical}
                onChange={(tags) => handleTagsChange('medical', tags)}
                inputProps={{
                  placeholder: '輸入醫療機構名稱後按 Enter 新增標籤',
                  className: 'react-tagsinput-input',
                }}
                addKeys={[13, 188]} // Enter 和 comma
              />
            </div>

            {/* 政府機構 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                政府機構
              </label>
              <TagsInput
                value={formData.government}
                onChange={(tags) => handleTagsChange('government', tags)}
                inputProps={{
                  placeholder: '輸入政府機構名稱後按 Enter 新增標籤',
                  className: 'react-tagsinput-input',
                }}
                addKeys={[13, 188]} // Enter 和 comma
              />
            </div>

            {/* 公共設施 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公共設施
              </label>
              <TagsInput
                value={formData.public_facilities}
                onChange={(tags) => handleTagsChange('public_facilities', tags)}
                inputProps={{
                  placeholder: '輸入公共設施名稱後按 Enter 新增標籤',
                  className: 'react-tagsinput-input',
                }}
                addKeys={[13, 188]} // Enter 和 comma
              />
            </div>

            {/* 其他 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                其他
              </label>
              <TagsInput
                value={formData.others}
                onChange={(tags) => handleTagsChange('others', tags)}
                inputProps={{
                  placeholder: '輸入其他設施名稱後按 Enter 新增標籤',
                  className: 'react-tagsinput-input',
                }}
                addKeys={[13, 188]} // Enter 和 comma
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
            className={`px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? '刊登中...' : '確認刊登'}
          </button>
        </div>
      </form>
    </div>
  )
}
