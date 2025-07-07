'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Note: Metadata export is commented out since this is now a client component
// If you need metadata, consider moving header to a separate server component
// export const metadata: Metadata = {
//   title: '999 房屋買賣網 - Demo',
//   description: '買房就上999！提供台灣最完整的房屋買賣資訊',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <html lang="zh-TW">
      <head>
        <title>999 房屋買賣網 - Demo</title>
        <meta
          name="description"
          content="買房就上999！提供台灣最完整的房屋買賣資訊"
        />
      </head>
      <body className={`${inter.className} morandi-gradient-bg`}>
        <header className="morandi-glass shadow-soft sticky top-0 z-50 border-b border-background-200/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">9</span>
                  </div>
                  <h1 className="text-2xl font-bold morandi-text-primary">
                    999房屋網
                  </h1>
                </div>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a
                  href="/"
                  className="morandi-text-secondary hover:text-primary-600 transition duration-300 font-medium px-4 py-2 rounded-lg hover:bg-primary-50/50"
                >
                  首頁
                </a>
                <a
                  href="/publish"
                  className="morandi-text-secondary hover:text-primary-600 transition duration-300 font-medium px-4 py-2 rounded-lg hover:bg-primary-50/50"
                >
                  刊登物件
                </a>
                <a
                  href="#"
                  className="morandi-text-secondary hover:text-primary-600 transition duration-300 font-medium px-4 py-2 rounded-lg hover:bg-primary-50/50"
                >
                  關於我們
                </a>
              </nav>
              <div className="md:hidden">
                <button
                  className="morandi-text-secondary hover:text-primary-600 p-2 rounded-lg hover:bg-primary-50/50 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {mobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* 手機版選單 */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-background-200/40 morandi-fade-in">
                <div className="px-2 pt-4 pb-6 space-y-2">
                  <a
                    href="/"
                    className="block px-4 py-3 morandi-text-secondary hover:text-primary-600 hover:bg-primary-50/60 rounded-xl transition duration-300 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🏠 首頁
                  </a>
                  <a
                    href="/publish"
                    className="block px-4 py-3 morandi-text-secondary hover:text-primary-600 hover:bg-primary-50/60 rounded-xl transition duration-300 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📝 刊登物件
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-3 morandi-text-secondary hover:text-primary-600 hover:bg-primary-50/60 rounded-xl transition duration-300 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ℹ️ 關於我們
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="bg-gradient-to-r from-text-primary to-primary-800 text-white/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">9</span>
                  </div>
                  <h3 className="text-xl font-bold">999房屋網</h3>
                </div>
                <p className="text-white/70 leading-relaxed">
                  精選優質房屋，提供最優雅舒適的房屋瀏覽體驗。讓您在尋找理想住所的過程中，享受視覺與心靈的雙重愉悅。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-6 text-white">快速連結</h3>
                <ul className="space-y-3 text-white/70">
                  <li>
                    <a
                      href="/"
                      className="hover:text-white transition duration-300 flex items-center space-x-2"
                    >
                      <span>🏠</span>
                      <span>物件搜尋</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/publish"
                      className="hover:text-white transition duration-300 flex items-center space-x-2"
                    >
                      <span>📝</span>
                      <span>刊登物件</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white transition duration-300 flex items-center space-x-2"
                    >
                      <span>📋</span>
                      <span>服務條款</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-6 text-white">聯絡我們</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>客服專線：02-1234-5678</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>✉️</span>
                    <span>信箱：service@999demo.com</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>⏰</span>
                    <span>服務時間：週一至週五 9:00-18:00</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
              <p>&copy; 2025 999房屋網 Demo. All rights reserved.</p>
              <p className="mt-2 text-sm">
                精選優質房屋，使用進階篩選功能找到最適合您的房屋
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
