<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 999 房屋網 Demo - Copilot 指南

## 專案概述

這是一個仿 999 房屋網的 demo 專案，主要功能包括房屋列表展示、搜尋篩選、房屋詳情和發佈房屋。

## 技術棧

- **框架**: Next.js 14 (使用 App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **狀態管理**: React Hooks

## 編碼規範

### 組件開發

- 使用 TypeScript 進行型別定義
- 組件使用 PascalCase 命名
- Props 介面命名為 `ComponentNameProps`
- 使用 `'use client'` 指令標註客戶端組件

### 樣式指南

- 優先使用 Tailwind CSS 類別
- 使用 primary 色彩系統 (橘色主題)
- 響應式設計：mobile-first 原則
- 使用語義化的 HTML 標籤

### 資料結構

- 房屋資料型別定義在 `src/data/houses.ts`
- 所有介面使用 TypeScript interface
- 模擬資料包含完整的房屋資訊

### 檔案組織

- 頁面放在 `src/app/` (App Router)
- 組件放在 `src/components/`
- 資料和型別定義放在 `src/data/`
- 使用 `@/` 作為 src 目錄的別名

### UI/UX 原則

- 房地產網站風格：專業、清晰、易用
- 卡片式設計展示房屋資訊
- 豐富的篩選功能
- 載入狀態和空狀態處理

## 開發重點

- 注重使用者體驗和載入效能
- 實作完整的搜尋和篩選功能
- 響應式設計適配各種裝置
- 程式碼品質和型別安全
