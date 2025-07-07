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
      <body className={inter.className}>
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">
                  999房屋網
                </h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a
                  href="/"
                  className="text-gray-700 hover:text-primary-600 transition duration-200"
                >
                  首頁
                </a>
                <a
                  href="/publish"
                  className="text-gray-700 hover:text-primary-600 transition duration-200"
                >
                  刊登物件
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-primary-600 transition duration-200"
                >
                  關於我們
                </a>
              </nav>
              <div className="md:hidden">
                <button
                  className="text-gray-700 hover:text-primary-600"
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
              <div className="md:hidden border-t border-gray-200">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <a
                    href="/"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    首頁
                  </a>
                  <a
                    href="/publish"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    刊登物件
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    關於我們
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="min-h-screen bg-gray-50">{children}</main>

        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">999房屋網</h3>
                <p className="text-gray-300">
                  提供最完整的房屋買賣資訊，讓您輕鬆找到理想的家。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">快速連結</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <a
                      href="/"
                      className="hover:text-white transition duration-200"
                    >
                      物件搜尋
                    </a>
                  </li>
                  <li>
                    <a
                      href="/post"
                      className="hover:text-white transition duration-200"
                    >
                      刊登物件
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white transition duration-200"
                    >
                      服務條款
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">聯絡我們</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>📞 客服專線：02-1234-5678</li>
                  <li>✉️ 信箱：service@999demo.com</li>
                  <li>⏰ 服務時間：週一至週五 9:00-18:00</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
              <p>&copy; 2024 999房屋網 Demo. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
