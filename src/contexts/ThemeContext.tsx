// src/contexts/ThemeContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/services/apiService' // 引入我們之前建立的 api 服務
import { hexToHsl } from '@/utils/colorUtils'
import tinycolor from 'tinycolor2'

// 定義主題的結構
interface Theme {
  primary: string // HEX format, e.g., "#ea580c"
  secondary: string
  accent: string
}

const ThemeContext = createContext({})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAndApplyTheme = async () => {
      try {
        // 假設 API 回傳基準顏色
        const baseHex = '#EA0000'
        const baseColor = tinycolor(baseHex)

        // 動態生成色階 (這只是個簡單範例，實際算法可能更複雜)
        const shades = {
          '50': baseColor.clone().lighten(35).toHexString(),
          '100': baseColor.clone().lighten(25).toHexString(),
          '200': baseColor.clone().lighten(15).toHexString(),
          '300': baseColor.clone().lighten(5).toHexString(),
          '400': baseColor.clone().lighten(2).toHexString(),
          '500': baseColor.clone().toHexString(), // 假設 500 是基準色
          '600': baseColor.clone().darken(5).toHexString(),
          '700': baseColor.clone().darken(12).toHexString(),
          '800': baseColor.clone().darken(20).toHexString(),
          '900': baseColor.clone().darken(28).toHexString(),
        }

        // 迴圈設定所有 CSS 變數
        for (const [shade, hex] of Object.entries(shades)) {
          const hsl = hexToHsl(hex)
          if (hsl) {
            document.documentElement.style.setProperty(
              `--primary-${shade}`,
              hsl
            )
          }
        }
      } catch (error) {
        console.error('載入主題失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndApplyTheme()
  }, [])

  // 這個 Provider 的主要工作是觸發 effect，也可以選擇性地傳遞 isLoading 狀態
  return (
    <ThemeContext.Provider value={{ isLoadingTheme: isLoading }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 可選：建立一個 hook 來讀取載入狀態
export function useTheme() {
  return useContext(ThemeContext)
}
