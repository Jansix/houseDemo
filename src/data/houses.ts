export interface House {
  id: string
  title: string
  price: number
  address: string
  area: number
  rooms: number
  bathrooms: number
  floor: string
  type: 'apartment' | 'house' | 'villa'
  images: string[]
  description: string
  postedDate: string
  features: string[]
  contact: {
    name: string
    phone: string
  }
}

export const houses: House[] = [
  {
    id: '1',
    title: '台北市大安區精美2房',
    price: 1580,
    address: '台北市大安區忠孝東路四段',
    area: 30,
    rooms: 2,
    bathrooms: 1,
    floor: '5/12',
    type: 'apartment',
    images: ['/placeholder-house-1.jpg', '/placeholder-house-2.jpg'],
    description:
      '近捷運站，生活機能佳，採光良好，適合小家庭居住。屋況佳，可立即入住。',
    postedDate: '2024-01-15',
    features: ['近捷運', '電梯', '陽台', '已裝潢'],
    contact: {
      name: '王先生',
      phone: '0912-345-678',
    },
  },
  {
    id: '2',
    title: '新北市板橋區溫馨3房',
    price: 880,
    address: '新北市板橋區文化路二段',
    area: 45,
    rooms: 3,
    bathrooms: 2,
    floor: '3/8',
    type: 'apartment',
    images: ['/placeholder-house-3.jpg', '/placeholder-house-4.jpg'],
    description: '裝潢新穎，位置優越，交通便利，投資自住兩相宜。',
    postedDate: '2024-01-18',
    features: ['新裝潢', '近車站', '車位', '管理員'],
    contact: {
      name: '李小姐',
      phone: '0923-456-789',
    },
  },
  {
    id: '3',
    title: '台中市西屯區豪華透天',
    price: 2380,
    address: '台中市西屯區台灣大道三段',
    area: 80,
    rooms: 4,
    bathrooms: 3,
    floor: '透天',
    type: 'house',
    images: ['/placeholder-house-5.jpg', '/placeholder-house-6.jpg'],
    description: '獨棟透天厝，花園車庫齊全，適合大家庭居住。',
    postedDate: '2024-01-20',
    features: ['花園', '車庫', '頂樓', '獨立門戶'],
    contact: {
      name: '張先生',
      phone: '0934-567-890',
    },
  },
  {
    id: '4',
    title: '高雄市前金區河景別墅',
    price: 6800,
    address: '高雄市前金區河東路',
    area: 120,
    rooms: 5,
    bathrooms: 4,
    floor: '別墅',
    type: 'villa',
    images: ['/placeholder-house-7.jpg', '/placeholder-house-8.jpg'],
    description: '面河景觀，豪華裝潢，私人游泳池，尊榮享受。',
    postedDate: '2024-01-22',
    features: ['河景', '游泳池', '豪華裝潢', '私人花園'],
    contact: {
      name: '陳女士',
      phone: '0945-678-901',
    },
  },
  {
    id: '5',
    title: '桃園市中壢區學區公寓',
    price: 458,
    address: '桃園市中壢區中山路',
    area: 20,
    rooms: 1,
    bathrooms: 1,
    floor: '2/6',
    type: 'apartment',
    images: ['/placeholder-house-9.jpg', '/placeholder-house-10.jpg'],
    description: '近大學校區，適合首購族或投資置產，價格實惠。',
    postedDate: '2024-01-25',
    features: ['近學校', '便利商店', '公車站', '首購推薦'],
    contact: {
      name: '劉先生',
      phone: '0956-789-012',
    },
  },
  {
    id: '6',
    title: '台南市安平區古蹟旁公寓',
    price: 650,
    address: '台南市安平區安平路',
    area: 25,
    rooms: 1,
    bathrooms: 1,
    floor: '1/4',
    type: 'apartment',
    images: ['/placeholder-house-11.jpg', '/placeholder-house-12.jpg'],
    description: '古色古香，鄰近安平古堡，文化氣息濃厚，稀有釋出。',
    postedDate: '2024-01-28',
    features: ['古蹟景點', '文化區', '美食街', '觀光區'],
    contact: {
      name: '黃小姐',
      phone: '0967-890-123',
    },
  },
]

export const cities = [
  '台北市',
  '新北市',
  '桃園市',
  '台中市',
  '台南市',
  '高雄市',
]

export const districts = {
  台北市: ['大安區', '信義區', '中山區', '松山區', '內湖區', '士林區'],
  新北市: ['板橋區', '新莊區', '中和區', '永和區', '土城區', '樹林區'],
  桃園市: ['中壢區', '桃園區', '平鎮區', '八德區', '蘆竹區', '大溪區'],
  台中市: ['西屯區', '北屯區', '南屯區', '大里區', '太平區', '豐原區'],
  台南市: ['安平區', '中西區', '東區', '南區', '北區', '安南區'],
  高雄市: ['前金區', '新興區', '鼓山區', '左營區', '三民區', '苓雅區'],
}
