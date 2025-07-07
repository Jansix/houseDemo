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
  introduction: string
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
