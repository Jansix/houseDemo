// 房屋相關的統一類型定義

// 基礎房屋資料介面
export interface BaseHouseData {
  title: string
  price: number
  addr: string
  area: number
  rooms: number
  living_rooms: number
  bathrooms: number
  total_floor: string
  current_floor: string
  age: string // 日期格式 YYYY-MM-DD 或 ISO 格式
  house_type: '公寓' | '透天' | '別墅'
  listing_type: '販售' | '出租'
  description: string
  introduction: string
  features: string[]
  current_status: '辦公室' | '住宅' | '工廠' | '混合用途' | '別墅'
  management_fee: number
  parking_space: '平面式' | '機械式' | '無' | '車庫'
  decoration:
    | '簡單裝潢'
    | '精裝裝潢'
    | '新裝潢'
    | '豪華裝潢'
    | '頂級豪華裝潢'
    | '復古裝潢'
  unit: '公寓' | '社區' | '華夏' | '獨棟' | '整戶' | '套房' | '透天' | '別墅'
  // 周邊機能欄位
  schools: string[]
  commercial_areas: string[]
  stores: string[]
  markets: string[]
  medical: string[]
  government: string[]
  others: string[]
  public_facilities: string[]
}

// 完整房屋資料介面（包含系統欄位）
export interface House extends BaseHouseData {
  house_id: string
  images: string[]
  posted_date: string
  updated: string
  // 聯絡資訊 (可選)
  contact?: {
    name: string
    phone: string
  }
}

// 發佈表單資料介面 - 限制為標準值
export interface PublishFormData {
  title: string
  price: number
  addr: string
  area: number
  rooms: number
  living_rooms: number
  bathrooms: number
  total_floor: string
  current_floor: string
  age: string // 日期格式 YYYY-MM-DD
  house_type: '公寓' | '透天' | '別墅'
  listing_type: '販售' | '出租'
  description: string
  introduction: string
  features: string[]
  current_status: '辦公室' | '住宅' | '工廠' | '混合用途'
  management_fee: number
  parking_space: '平面式' | '機械式' | '無'
  decoration: '簡單裝潢' | '精裝裝潢' | '新裝潢' | '豪華裝潢' | '頂級豪華裝潢'
  unit: '公寓' | '社區' | '華夏' | '獨棟'
  // 周邊機能欄位
  schools: string[]
  commercial_areas: string[]
  stores: string[]
  markets: string[]
  medical: string[]
  government: string[]
  others: string[]
  public_facilities: string[]
  imagesBase64?: string[] // Base64 格式的圖片列表
  // 聯絡資訊 (可選)
  contact?: {
    name: string
    phone: string
  }
}

// 房屋卡片展示所需的精簡資料
export interface HouseCard {
  house_id: string
  title: string
  price: number
  addr: string
  area: number
  rooms: number
  living_rooms: number
  bathrooms: number
  house_type: string
  images: string[]
  features: string[]
  posted_date: string
}

// 搜尋篩選條件 - 完整的搜尋表單介面
export interface SearchFilters {
  keyword: string
  city: string
  district: string
  minPrice: number
  maxPrice: number
  minArea: number
  maxArea: number
  rooms: string
  type: string
}

// 房屋篩選條件 - 簡化版本用於其他組件
export interface HouseFilters {
  type?: '公寓' | '透天' | '別墅'
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  rooms?: number
  location?: string
}
