'use client'
import { ThemeProvider } from '@/contexts/ThemeContext' // 引入 ThemeProvider
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AuthProvider } from '@/contexts/AuthContext'
import NavigationAuth from '@/components/NavigationAuth'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import config from '@/data/config'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <html lang="zh-TW" className="light" style={{ colorScheme: 'light' }}>
      <head>
        <title>{config.title}</title>
        <meta name="description" content="提供台灣最完整的房屋買賣資訊" />
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className={`${inter.className} bg-gray-50 text-gray-900`}
        style={{ colorScheme: 'light' }}
      >
        <ThemeProvider>
          <AuthProvider>
            <header className="bg-white shadow-md sticky top-0 z-50 text-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/ly_logo.png"
                      alt={`${config.title} Logo`}
                      width={40}
                      height={40}
                      className="h-10 w-auto"
                      priority
                    />
                    <h1 className="text-2xl font-bold text-primary-600">
                      {config.title}
                    </h1>
                  </div>
                  <nav className="hidden md:flex space-x-8">
                    <Link
                      href="/"
                      className="text-gray-700 hover:text-primary-600 transition duration-200"
                    >
                      首頁
                    </Link>
                    <Link
                      href="/publish"
                      className="text-gray-700 hover:text-primary-600 transition duration-200"
                    >
                      刊登物件
                    </Link>
                    {/* <Link
                      href="#"
                      className="text-gray-700 hover:text-primary-600 transition duration-200"
                    >
                      關於我們
                    </Link> */}
                    <NavigationAuth />
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
                      <Link
                        href="/"
                        className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        首頁
                      </Link>
                      <Link
                        href="/publish"
                        className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        刊登物件
                      </Link>
                      {/* <Link
                        href="#"
                        className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        關於我們
                      </Link> */}
                    </div>
                  </div>
                )}
              </div>
            </header>

            <main className="min-h-screen bg-gray-50 text-gray-900">
              {children}
            </main>

            <footer
              className="bg-gradient-to-b from-gradientMain to-gradientSub text-white"
              style={{
                background:
                  'linear-gradient(to right, hsl(var(--gradient-main)), hsl(var(--gradient-mid)), hsl(var(--gradient-sub)))',
                boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)', // 增加質感陰影
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4">{config.title}</h3>
                    <p className="text-gray-300">
                      精選優質房屋，提供最優雅舒適的房屋瀏覽體驗。讓您在尋找理想住所的過程中，享受視覺與心靈的雙重愉悅。
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-4 text-center">
                      快速連結
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-center">
                      <li>
                        <Link
                          href="/"
                          className="hover:text-white transition duration-200"
                        >
                          物件搜尋
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/publish"
                          className="hover:text-white transition duration-200"
                        >
                          刊登物件
                        </Link>
                      </li>
                      {/* <li>
                        <Link
                          href="#"
                          className="hover:text-white transition duration-200"
                        >
                          服務條款
                        </Link>
                      </li> */}
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
                <div className=" mt-8 pt-8 text-center text-gray-300">
                  <p>&copy; 2025 {config.title} Demo. All rights reserved.</p>
                </div>
              </div>
            </footer>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#333',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
