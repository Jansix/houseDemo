// components/MyPDFDocument.js
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { Image } from '@react-pdf/renderer'

// 1. 確保字體已註冊且路徑正確
Font.register({
  family: 'Noto Sans TC', // 這個名稱會與您 CSS 中定義的 font-family 一致
  src: '/fonts/微軟正黑體.ttf',
})
const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontSize: 8,
    lineHeight: 1.2,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: 'Noto Sans TC',
  },

  // 主標題區域 - 模仿網頁頂部
  headerSection: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1f2937',
    fontFamily: 'Noto Sans TC',
  },

  address: {
    fontSize: 7,
    color: '#6b7280',
    marginBottom: 4,
    fontFamily: 'Noto Sans TC',
  },

  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  mainPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    marginRight: 8,
    fontFamily: 'Noto Sans TC',
  },

  priceLabel: {
    fontSize: 7,
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginRight: 6,
    fontFamily: 'Noto Sans TC',
  },

  priceDetail: {
    fontSize: 7,
    color: '#6b7280',
    fontFamily: 'Noto Sans TC',
  },

  // 兩欄佈局容器
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },

  // 左欄 - 主要內容 (約佔65%)
  leftColumn: {
    width: '65%',
  },

  // 右欄 - 側邊欄 (約佔35%)
  rightColumn: {
    width: '35%',
  },

  // 卡片樣式
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#374151',
    fontFamily: 'Noto Sans TC',
  },

  // 基本資訊網格
  basicInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },

  basicInfoItem: {
    width: '50%',
    textAlign: 'center',
  },

  basicInfoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },

  basicInfoLabel: {
    marginTop: 4,
    fontSize: 6,
    color: '#6b7280',
  },

  // 詳細資料表格
  detailTable: {
    marginBottom: 2,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f3f4f6',
  },

  detailLabel: {
    fontSize: 7,
    color: '#6b7280',
    width: '40%',
  },

  detailValue: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#1f2937',
    width: '60%',
    textAlign: 'right',
  },

  // 特色標籤
  featureContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },

  featureTag: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 3,
    marginBottom: 3,
    borderRadius: 2,
  },

  featureText: {
    fontSize: 6,
    color: '#1e40af',
  },

  // 周邊機能
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  facilityItem: {
    width: '50%',
    marginBottom: 6,
    paddingRight: 8,
  },

  facilityTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 2,
  },

  facilityText: {
    fontSize: 6,
    color: '#6b7280',
    lineHeight: 1.3,
  },

  // 描述文字
  description: {
    fontSize: 7,
    color: '#374151',
    lineHeight: 1.4,
    textAlign: 'justify',
  },

  // 右側欄樣式
  priceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    textAlign: 'center',
  },

  rightSidePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 6,
  },

  rightSidePriceDetail: {
    fontSize: 6,
    color: '#6b7280',
    marginBottom: 6,
  },

  contactInfo: {
    textAlign: 'center',
    marginBottom: 6,
  },

  contactName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },

  contactPhone: {
    fontSize: 7,
    color: '#374151',
  },

  // 計算工具
  calculatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calculatorItem: {
    width: '50%',
    marginBottom: 4,
  },

  calculatorLabel: {
    fontSize: 6,
    color: '#6b7280',
    marginBottom: 1,
  },

  calculatorValue: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  // 頁腳
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    right: 15,
    textAlign: 'center',
    fontSize: 5,
    color: '#9ca3af',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
    paddingTop: 4,
    fontFamily: 'Noto Sans TC',
  },
})

export const MyPDFDocument = ({ house }) => {
  if (!house) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.card}>
            <Text style={styles.title}>載入中...</Text>
            <Text>房屋資料載入中，請稍候。</Text>
          </View>
        </Page>
      </Document>
    )
  }

  const typeMap = {
    apartment: '公寓',
    house: '透天厝',
    villa: '別墅',
    公寓: '公寓',
    透天厝: '透天厝',
    別墅: '別墅',
  }

  const currentDate = new Date().toLocaleDateString('zh-TW')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 標題區域 - 模仿網頁頭部 */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{house.title}</Text>
          <Text style={styles.address}> {house.addr}</Text>
          <View style={styles.priceSection}>
            <Text style={styles.mainPrice}>
              {house.listing_type === '出租'
                ? `${house.price}`
                : `${house.price}萬`}
            </Text>
            <Text style={styles.priceLabel}>
              {house.listing_type === '出租' ? '元/月' : '總價'}
            </Text>
            <Text style={styles.priceDetail}>
              {house.listing_type === '出租'
                ? `每坪約${Math.round(house.price / house.area)}元/月`
                : `單價約${Math.round(
                    (house.price * 10000) / house.area
                  )}元/坪`}
            </Text>
          </View>
        </View>

        {/* 兩欄式佈局 - 模仿網頁結構 */}
        <View style={styles.twoColumnContainer}>
          {/* 左欄 - 主要內容 */}
          <View style={styles.leftColumn}>
            {/* 房屋基本資訊 - 模仿網頁卡片 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>房屋基本資訊</Text>
              <View style={styles.basicInfoGrid}>
                <View style={styles.basicInfoItem}>
                  <Text style={styles.basicInfoValue}>
                    {house.rooms}房{house.living_rooms}廳{house.bathrooms}衛
                  </Text>
                  <Text style={styles.basicInfoLabel}>格局</Text>
                </View>
                <View style={styles.basicInfoItem}>
                  <Text style={styles.basicInfoValue}>{house.area}</Text>
                  <Text style={styles.basicInfoLabel}>坪數</Text>
                </View>
                <View style={styles.basicInfoItem}>
                  <Text style={styles.basicInfoValue}>
                    {house.current_floor}/{house.total_floor}樓
                  </Text>
                  <Text style={styles.basicInfoLabel}>樓層</Text>
                </View>
                <View style={styles.basicInfoItem}>
                  <Text style={styles.basicInfoValue}>
                    {new Date().getFullYear() -
                      new Date(house.age).getFullYear()}
                    年
                  </Text>
                  <Text style={styles.basicInfoLabel}>屋齡</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <div style={{ height: '170px', backgroundColor: '#f0f0f0' }}>
                內容
              </div>
            </View>

            {/* 房屋詳細資料 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>房屋資料</Text>
              <View style={styles.detailTable}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>現況</Text>
                  <Text style={styles.detailValue}>{house.current_status}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>型態</Text>
                  <Text style={styles.detailValue}>
                    {typeMap[house.house_type] || house.house_type}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>管理費</Text>
                  <Text style={styles.detailValue}>
                    {house.management_fee > 0
                      ? `${house.management_fee}元/月`
                      : '無'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>車位</Text>
                  <Text style={styles.detailValue}>{house.parking_space}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>裝潢程度</Text>
                  <Text style={styles.detailValue}>{house.decoration}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>單位</Text>
                  <Text style={styles.detailValue}>{house.unit}</Text>
                </View>
              </View>
            </View>

            {/* 物件特色 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>物件特色</Text>
              <View style={styles.featureContainer}>
                {house.features.slice(0, 8).map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <Text style={styles.featureText}>✓ {feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 屋況特色 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>屋況特色</Text>
              <Text style={styles.description}>
                {house.description.length > 150
                  ? `${house.description.substring(0, 150)}...`
                  : house.description}
              </Text>
            </View>

            {/* 周邊機能 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>周邊機能</Text>
              <View style={styles.facilitiesGrid}>
                {house.schools && house.schools.length > 0 && (
                  <View style={styles.facilityItem}>
                    <Text style={styles.facilityTitle}>學區</Text>
                    <Text style={styles.facilityText}>
                      {house.schools?.join('、')}
                    </Text>
                  </View>
                )}
                {house.commercial_areas &&
                  house.commercial_areas.length > 0 && (
                    <View style={styles.facilityItem}>
                      <Text style={styles.facilityTitle}>熱門商圈</Text>
                      <Text style={styles.facilityText}>
                        {house.commercial_areas?.join('、')}
                      </Text>
                    </View>
                  )}
                {house.stores && house.stores.length > 0 && (
                  <View style={styles.facilityItem}>
                    <Text style={styles.facilityTitle}>超商/賣場</Text>
                    <Text style={styles.facilityText}>
                      {house.stores?.join('、')}
                    </Text>
                  </View>
                )}
                {house.medical && house.medical.length > 0 && (
                  <View style={styles.facilityItem}>
                    <Text style={styles.facilityTitle}>醫療機構</Text>
                    <Text style={styles.facilityText}>
                      {house.medical?.join('、')}
                    </Text>
                  </View>
                )}
                {house.markets && house.markets.length > 0 && (
                  <View style={styles.facilityItem}>
                    <Text style={styles.facilityTitle}>傳統市場</Text>
                    <Text style={styles.facilityText}>
                      {house.markets?.join('、')}
                    </Text>
                  </View>
                )}
                {house.government && house.government.length > 0 && (
                  <View style={styles.facilityItem}>
                    <Text style={styles.facilityTitle}>政府機構</Text>
                    <Text style={styles.facilityText}>
                      {house.government?.join('、')}
                    </Text>
                  </View>
                )}
                {house.others && house.others.length > 0 && (
                  <View style={styles.facilityItem}>
                    <Text style={styles.facilityTitle}>其他配套</Text>
                    <Text style={styles.facilityText}>
                      {house.others?.join('、')}
                    </Text>
                  </View>
                )}
                {house.public_facilities &&
                  house.public_facilities.length > 0 && (
                    <View style={styles.facilityItem}>
                      <Text style={styles.facilityTitle}>公共建設</Text>
                      <Text style={styles.facilityText}>
                        {house.public_facilities?.join('、')}
                      </Text>
                    </View>
                  )}
              </View>
            </View>
          </View>

          {/* 右欄 - 側邊欄，模仿網頁右側 */}
          <View style={styles.rightColumn}>
            {/* 價格資訊卡片 */}
            <View style={styles.priceCard}>
              <Text style={styles.rightSidePrice}>
                {house.listing_type === '出租'
                  ? `${house.price}元/月`
                  : `${house.price}萬`}
              </Text>
              <Text style={styles.rightSidePriceDetail}>
                {house.listing_type === '出租'
                  ? `${house.parking_space === '無' ? '' : '含車位'}租金`
                  : `${house.parking_space === '無' ? '' : '含車位'}價格`}
              </Text>
              <Text style={styles.rightSidePriceDetail}>
                {house.listing_type === '出租'
                  ? `每坪約${Math.round(house.price / house.area)}元/月`
                  : `單價約${Math.round(
                      (house.price * 10000) / house.area
                    )}元/坪`}
              </Text>
            </View>

            {/* 聯絡資訊 */}
            {house.contact && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>聯絡資訊</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{house.contact.name}</Text>
                  {house.contact.phone && (
                    <Text style={styles.contactPhone}>
                      {house.contact.phone}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* 計算工具 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {house.listing_type === '出租' ? '租屋試算' : '房貸試算'}
              </Text>

              {house.listing_type === '出租' ? (
                <View style={styles.calculatorGrid}>
                  <View style={styles.calculatorItem}>
                    <Text style={styles.calculatorLabel}>月租金</Text>
                    <Text style={styles.calculatorValue}>{house.price}元</Text>
                  </View>
                  <View style={styles.calculatorItem}>
                    <Text style={styles.calculatorLabel}>押金(2個月)</Text>
                    <Text style={styles.calculatorValue}>
                      {(house.price * 2).toLocaleString()}元
                    </Text>
                  </View>
                  <View style={styles.calculatorItem}>
                    <Text style={styles.calculatorLabel}>年租金總額</Text>
                    <Text style={styles.calculatorValue}>
                      {(house.price * 12).toLocaleString()}元
                    </Text>
                  </View>
                  <View style={styles.calculatorItem}>
                    <Text style={styles.calculatorLabel}>每坪月租</Text>
                    <Text style={styles.calculatorValue}>
                      約{Math.round(house.price / house.area)}元/坪
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.calculatorGrid}>
                  <View style={styles.calculatorItem}>
                    <Text style={styles.calculatorLabel}>物件總價</Text>
                    <Text style={styles.calculatorValue}>{house.price}萬</Text>
                  </View>
                  <View style={styles.calculatorItem}>
                    <Text style={styles.calculatorLabel}>頭期款(30%)</Text>
                    <Text style={styles.calculatorValue}>
                      {Math.round(house.price * 0.3)}萬
                    </Text>
                  </View>
                  <View style={styles.calculatorItem}>
                    <Text style={styles.calculatorLabel}>貸款金額(70%)</Text>
                    <Text style={styles.calculatorValue}>
                      {Math.round(house.price * 0.7)}萬
                    </Text>
                  </View>
                  <View style={styles.calculatorItem}>
                    <Text style={styles.calculatorLabel}>月付金額(30年)</Text>
                    <Text style={styles.calculatorValue}>
                      約
                      {Math.round(
                        (house.price * 0.7 * 10000 * 0.02) / 12
                      ).toLocaleString()}
                      元
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 頁腳 */}
        <Text style={styles.footer}>
          生成日期：{currentDate} | 刊登日期：
          {new Date(house.posted_date).toLocaleDateString('zh-TW')} | 房屋編號：
          {house.house_id}
        </Text>
      </Page>
    </Document>
  )
}
