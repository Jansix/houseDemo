'use client'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SystemProvider } from '@/contexts/SystemContext'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import Link from 'next/link'
import { AuthProvider } from '@/contexts/AuthContext'
import NavigationAuth from '@/components/NavigationAuth'
import FooterNavigation from '@/components/FooterNavigation'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { useGlobalContact, useWebInfo } from '@/contexts/SystemContext'

const inter = Inter({ subsets: ['latin'] })

// 內部組件來使用系統配置
function LayoutContent({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const globalContact = useGlobalContact()
  const webInfo = useWebInfo()
  const webTitle = webInfo.webTitle
  const webLogo = webInfo.webLogo
  // 嘗試從 webInfo 直接取 gradientHorizontal，若不存在則 fallback false
  let gradientHorizontal = false
  if ('gradientHorizontal' in webInfo) {
    gradientHorizontal = Boolean((webInfo as any).gradientHorizontal)
  }

  return (
    <>
      <AuthProvider>
        <header className="bg-white shadow-md sticky top-0 z-50 text-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {webTitle ? (
                <Link
                  href="/"
                  className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition duration-200"
                >
                  {webLogo && (
                    <img
                      src={`https://house_demo.codychen.me${webLogo}`}
                      alt={webTitle}
                      width={40}
                      height={40}
                      className="h-10 w-auto"
                    />
                  )}
                  <h1 className="text-2xl font-bold text-primary-600">
                    {webTitle}
                  </h1>
                </Link>
              ) : (
                <div
                  className="flex items-center space-x-3"
                  style={{ height: 40 }}
                ></div>
              )}
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-primary-600 transition duration-200"
                >
                  首頁
                </Link>
                {/* LINE 按鈕 */}
                <a
                  href={globalContact?.line_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .629.285.629.63v4.141h1.756c.348 0 .629.283.629.629 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  <span>LINE</span>
                </a>
                {/* WhatsApp 按鈕 */}
                <a
                  href={globalContact?.whatsapp_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
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
                  {/* LINE 按鈕 - 手機版 */}
                  <a
                    href={globalContact?.line_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .629.285.629.63v4.141h1.756c.348 0 .629.283.629.629 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    <span>LINE</span>
                  </a>
                  {/* WhatsApp 按鈕 - 手機版 */}
                  <a
                    href={globalContact?.whatsapp_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                  {/* 手機版的導航認證區域 */}
                  <div className="px-3 py-2">
                    <NavigationAuth />
                  </div>
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
            background: `linear-gradient(to ${
              gradientHorizontal ? 'right' : 'bottom'
            }, hsl(var(--gradient-main)), hsl(var(--gradient-mid)), hsl(var(--gradient-sub)))`,
            boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">{webTitle}</h3>
                <p className="text-gray-300">
                  精選優質房屋，提供最優雅舒適的房屋瀏覽體驗。讓您在尋找理想住所的過程中，享受視覺與心靈的雙重愉悅。
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-bold mb-4 text-center">快速連結</h3>
                <FooterNavigation />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">聯絡我們</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>📞 客服專線: (02) 8521-1068</li>
                  <li>公司名稱: 隆悅不動產經紀公司</li>
                  {/* <li>✉️ 信箱：service@999demo.com</li>
                  <li>⏰ 服務時間：週一至週五 9:00-18:00</li> */}
                </ul>
              </div>
            </div>
            <div className=" mt-8 pt-8 text-center text-gray-300">
              <p>&copy; 2025 {webTitle} . All rights reserved.</p>
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
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className="light" style={{ colorScheme: 'light' }}>
      <head>
        <title>房屋平台</title>
        <meta name="description" content="提供台灣最完整的房屋租售資訊" />
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className={`${inter.className} bg-gray-50 text-gray-900`}
        style={{ colorScheme: 'light' }}
      >
        <SystemProvider>
          <ThemeProvider>
            <LayoutContent>{children}</LayoutContent>
          </ThemeProvider>
        </SystemProvider>
      </body>
    </html>
  )
}
