export interface House {
  id: string
  title: string
  price: number
  address: string
  area: number
  rooms: number
  bathrooms: number
  floor: string
  age: number // 屋齡
  type: 'apartment' | 'house' | 'villa'
  images: string[]
  description: string
  introduction: string
  postedDate: string
  features: string[]
  // 新增房屋詳細資訊
  houseDetails: {
    currentStatus: string // 現況
    managementFee: number // 管理費 (元/月)
    parkingSpace: boolean // 是否有車位
    decoration: string // 裝潢程度
    unit: string // 單位類型
  }
  // 新增周邊機能
  nearbyFacilities: {
    schools: string[] // 學區
    commercialAreas: string[] // 熱門商圈
    stores: string[] // 超商/賣場
    markets: string[] // 傳統市場
    medical: string[] // 醫療機構
    government: string[] // 政府機構
    others: string[] // 其他配套
    publicFacilities: string[] // 公共建設
  }
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
    age: 15,
    type: 'apartment',
    images: [
      '/house1.png',
      '/house2.png',
      '/house3.png',
      '/house4.png',
      '/house1.png',
      '/house2.png',
      '/house3.png',
      '/house4.png',
    ],
    description:
      '近捷運站，生活機能佳，採光良好，適合小家庭居住。屋況佳，可立即入住。',
    introduction: `
      <h3>全新裝潢精品住宅</h3>
      <p>本物件為全新裝潢的精品住宅，採用頂級建材與設計師規劃，擁有極佳的採光與通風。</p>

      <h4>交通便利</h4>
      <ul>
        <li>步行3分鐘至捷運忠孝復興站</li>
        <li>多線公車路線，四通八達</li>
        <li>鄰近敦化南路，開車族便利</li>
      </ul>

      <h4>生活機能</h4>
      <ul>
        <li>SOGO復興館步行5分鐘</li>
        <li>太平洋鐵板燒等知名餐廳林立</li>
        <li>全聯、7-11、星巴克等便利商店齊全</li>
      </ul>

      <p>屋主誠售，歡迎預約看屋！</p>
    `,
    postedDate: '2024-01-15',
    features: ['近捷運', '電梯', '陽台', '已裝潢'],
    houseDetails: {
      currentStatus: '住宅',
      managementFee: 3000,
      parkingSpace: true,
      decoration: '精裝裝潢',
      unit: '整戶｜已含車位',
    },
    nearbyFacilities: {
      schools: ['大安國小', '龍門國中', '師大附中'],
      commercialAreas: ['忠孝復興商圈', 'SOGO商圈', '微風廣場商圈'],
      stores: ['全聯(復興店)', '7-11', '星巴克', 'SOGO復興館'],
      markets: ['建國假日市場', '大安市場'],
      medical: ['台大醫院', '國泰醫院', '安心診所'],
      government: ['大安區公所', '信義分局'],
      others: ['微風廣場', 'SOGO復興館', '誠品書店'],
      publicFacilities: [
        '大安森林公園',
        '建國啤酒廠',
        '台北市立圖書館大安分館',
      ],
    },
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
    age: 8,
    type: 'apartment',
    images: ['/house1.png', '/house2.png', '/house3.png', '/house4.png'],
    description: '裝潢新穎，位置優越，交通便利，投資自住兩相宜。',
    introduction: `
      <h3>溫馨三房好選擇</h3>
      <p>本物件位於板橋文化路精華地段，為新裝潢三房兩廳格局，適合小家庭或首購族群。</p>

      <h4>格局介紹</h4>
      <ul>
        <li>客廳：挑高設計，採光佳</li>
        <li>主臥：附衛浴，雙人床擺放無問題</li>
        <li>次臥：可當書房或兒童房使用</li>
        <li>廚房：L型廚具，收納空間充足</li>
      </ul>

      <p>社區管理完善，24小時管理員，居住安全有保障。</p>
    `,
    postedDate: '2024-01-18',
    features: ['新裝潢', '近車站', '車位', '管理員'],
    houseDetails: {
      currentStatus: '住宅',
      managementFee: 4500,
      parkingSpace: true,
      decoration: '新裝潢',
      unit: '整戶｜含車位',
    },
    nearbyFacilities: {
      schools: ['板橋國小', '板橋國中', '板橋高中'],
      commercialAreas: ['板橋車站商圈', '大遠百商圈'],
      stores: ['板橋大遠百', 'FE21', '全聯超市'],
      markets: ['南雅夜市', '板橋湳興市場'],
      medical: ['亞東醫院', '板橋醫院'],
      government: ['板橋區公所', '新北市政府'],
      others: ['板橋車站', '環球購物中心'],
      publicFacilities: ['435藝文特區', '板橋林家花園', '新板特區'],
    },
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
    age: 5,
    type: 'house',
    images: ['/house1.png', '/house2.png', '/house3.png', '/house4.png'],
    description: '獨棟透天厝，花園車庫齊全，適合大家庭居住。',
    introduction: `
      <h3>獨棟透天厝，享受私密生活</h3>
      <p>此為全新完工的獨棟透天厝，擁有前後花園及雙車位，享受獨門獨院的私密空間。</p>

      <h4>樓層規劃</h4>
      <ul>
        <li>1F：客廳、餐廳、廚房、客用衛浴</li>
        <li>2F：主臥、次臥、家庭廳</li>
        <li>3F：書房、儲藏室</li>
        <li>頂樓：曬衣空間、休憩區</li>
      </ul>

      <p>鄰近逢甲夜市、台中榮總，生活機能極佳。</p>
    `,
    postedDate: '2024-01-20',
    features: ['花園', '車庫', '頂樓', '獨立門戶'],
    houseDetails: {
      currentStatus: '住宅',
      managementFee: 0,
      parkingSpace: true,
      decoration: '豪華裝潢',
      unit: '透天｜含雙車位',
    },
    nearbyFacilities: {
      schools: ['西屯國小', '西苑中學', '逢甲大學'],
      commercialAreas: ['逢甲夜市', '新光三越', '台中港路商圈'],
      stores: ['家樂福西屯店', '全聯超市', 'IKEA台中店'],
      markets: ['逢甲夜市', '西屯市場'],
      medical: ['台中榮總', '澄清醫院'],
      government: ['西屯區公所', '台中市政府'],
      others: ['新光三越', '老虎城購物中心'],
      publicFacilities: ['都會公園', '秋紅谷', '逢甲大學'],
    },
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
    age: 3,
    type: 'villa',
    images: ['/house1.png', '/house2.png', '/house3.png', '/house4.png'],
    description: '面河景觀，豪華裝潢，私人游泳池，尊榮享受。',
    introduction: `
      <h3>頂級河景別墅，奢華生活首選</h3>
      <p>坐擁愛河第一排景觀位置，270度河景視野，豪華裝潢配備頂級設施。</p>

      <h4>頂級設備</h4>
      <ul>
        <li>私人游泳池配備過濾系統</li>
        <li>景觀花園由專業園藝師設計</li>
        <li>進口廚具及衛浴設備</li>
        <li>中央空調系統</li>
        <li>智能居家系統</li>
      </ul>

      <h4>周邊環境</h4>
      <p>步行即達愛河岸，晨昏皆可享受河畔散步樂趣，鄰近85大樓商圈、高雄車站。</p>
    `,
    postedDate: '2024-01-22',
    features: ['河景', '游泳池', '豪華裝潢', '私人花園'],
    houseDetails: {
      currentStatus: '別墅',
      managementFee: 0,
      parkingSpace: true,
      decoration: '頂級豪華裝潢',
      unit: '別墅｜含私人花園',
    },
    nearbyFacilities: {
      schools: ['前金國小', '前金國中', '高雄中學'],
      commercialAreas: ['85大樓商圈', '夢時代', '統一夢時代'],
      stores: ['統一夢時代', '新光三越', '大立百貨'],
      markets: ['六合夜市', '前金市場'],
      medical: ['高雄醫學大學附設醫院', '阮綜合醫院'],
      government: ['前金區公所', '高雄市政府'],
      others: ['85大樓', '高雄港', '愛河'],
      publicFacilities: ['愛河', '高雄港', '中央公園', '駁二藝術特區'],
    },
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
    age: 12,
    type: 'apartment',
    images: ['/house1.png', '/house2.png', '/house3.png', '/house4.png'],
    description: '近大學校區，適合首購族或投資置產，價格實惠。',
    introduction: `
      <h3>學區首選，投資自住皆宜</h3>
      <p>位於中央大學學區內，步行5分鐘即達校園，周邊學生族群穩定，投資報酬率佳。</p>

      <h4>投資優勢</h4>
      <ul>
        <li>租金收益穩定，年收益率約5-6%</li>
        <li>學區房保值性佳</li>
        <li>首購族負擔輕鬆</li>
      </ul>

      <h4>生活機能</h4>
      <p>7-11、全家便利商店林立，中壢夜市步行10分鐘，生活便利性極高。</p>
    `,
    postedDate: '2024-01-25',
    features: ['近學校', '便利商店', '公車站', '首購推薦'],
    houseDetails: {
      currentStatus: '住宅',
      managementFee: 2000,
      parkingSpace: false,
      decoration: '簡單裝潢',
      unit: '套房｜無車位',
    },
    nearbyFacilities: {
      schools: ['中央大學', '中壢國小', '中壢國中'],
      commercialAreas: ['中壢車站商圈', '中原夜市'],
      stores: ['全聯超市', '7-11', '全家便利商店'],
      markets: ['中壢觀光夜市', '中原夜市'],
      medical: ['壢新醫院', '天晟醫院'],
      government: ['中壢區公所', '桃園市政府'],
      others: ['中壢車站', 'SOGO中壢店'],
      publicFacilities: ['中央大學', '龍岡圖書館', '中壢藝術館'],
    },
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
    age: 25,
    type: 'apartment',
    images: ['/house1.png', '/house2.png', '/house3.png', '/house4.png'],
    description: '古色古香，鄰近安平古堡，文化氣息濃厚，稀有釋出。',
    introduction: `
      <h3>古都風情，文化精品宅</h3>
      <p>坐落於安平歷史文化園區內，步行2分鐘即達安平古堡，享受古都慢活步調。</p>

      <h4>文化環境</h4>
      <ul>
        <li>安平古堡、德記洋行近在咫尺</li>
        <li>樹屋、朱玖瑩故居等景點林立</li>
        <li>老街美食：周氏蝦捲、陳家蚵捲</li>
      </ul>

      <h4>居住品質</h4>
      <p>老公寓翻新，保留復古元素融入現代設計，一樓有專屬小庭院。</p>
    `,
    postedDate: '2024-01-28',
    features: ['古蹟景點', '文化區', '美食街', '觀光區'],
    houseDetails: {
      currentStatus: '住宅',
      managementFee: 1500,
      parkingSpace: false,
      decoration: '復古裝潢',
      unit: '套房｜含小庭院',
    },
    nearbyFacilities: {
      schools: ['安平國小', '安平國中', '台南大學'],
      commercialAreas: ['安平老街', '觀夕平台商圈'],
      stores: ['7-11', '全家便利商店', '安平老街商店'],
      markets: ['安平市場', '安平魚市場'],
      medical: ['安南醫院', '郭綜合醫院'],
      government: ['安平區公所', '台南市政府'],
      others: ['安平古堡', '德記洋行', '朱玖瑩故居'],
      publicFacilities: [
        '安平古堡',
        '安平樹屋',
        '觀夕平台',
        '四草生態文化園區',
      ],
    },
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

// 提供一個安全的取得區域的函數
export const getDistrictsByCity = (city: string): string[] => {
  if (!city || typeof city !== 'string') return []
  return districts[city as keyof typeof districts] || []
}

// 確保資料完整性的檢查
if (typeof window !== 'undefined') {
  console.log('台灣地區資料載入完成:', {
    citiesCount: cities.length,
    districtsKeys: Object.keys(districts).length,
  })
}
