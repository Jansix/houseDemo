# 999 房屋買賣網 Demo

這是一個仿999房屋網的demo專案，使用 Next.js 14 + React 18 + Tailwind CSS 建構。

## 功能特色

- 🏠 房屋列表展示
- 🔍 多條件搜尋和篩選
- 📱 響應式設計
- ⚡ 快速載入和互動

## 頁面說明

1. **首頁 (列表頁)** - 展示所有房屋，提供搜尋和篩選功能
2. **詳情頁** - 顯示單一房屋的詳細資訊
3. **發佈頁** - 讓使用者刊登新房屋 (待開發)

## 技術架構

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **狀態管理**: React Hooks
- **資料**: 本地 JSON 模擬資料

## 開始使用

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

### 建置專案

```bash
npm run build
```

### 啟動正式版

```bash
npm start
```

## 專案結構

```
src/
├── app/                  # Next.js App Router 頁面
│   ├── layout.tsx       # 全域佈局
│   ├── page.tsx         # 首頁
│   └── globals.css      # 全域樣式
├── components/          # React 組件
│   ├── SearchFilters.tsx # 搜尋篩選組件
│   └── HouseList.tsx    # 房屋列表組件
└── data/
    └── houses.ts        # 房屋模擬資料
```

## 主要功能

### 搜尋和篩選
- 關鍵字搜尋
- 地區選擇 (城市/區域)
- 售價範圍
- 坪數範圍
- 房間數量
- 物件類型

### 房屋列表
- 卡片式展示
- 價格、地址、房型資訊
- 特色標籤
- 載入狀態

### 房屋詳情
- 完整房屋資訊展示
- 圖片輪播展示
- 聯絡方式
- 特色標籤
- 返回列表功能

## 待開發功能

- [ ] 發佈房屋頁面
- [ ] 地圖整合
- [ ] 收藏功能
- [ ] 分頁功能
- [ ] 排序功能

## 授權

此專案僅供學習和demo用途。
