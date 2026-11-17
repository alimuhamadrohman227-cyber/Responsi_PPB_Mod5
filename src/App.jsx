import { useState, lazy, Suspense } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import PWABadge from './components/PWABadge.jsx'
import './App.css'

// Lazy Loading Halaman Utama (Code Splitting PWA)
const Home = lazy(() => import('./pages/Home.jsx'))
const Manage = lazy(() => import('./pages/Manage.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))

function App() {
  const [tab, setTab] = useState('Catalog') // 'Catalog' | 'Manage' | 'Profile'

  // Handler Navigasi Tab
  const handleTabChange = (targetTab) => {
    setTab(targetTab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="shell">
      {/* Header Navigasi */}
      <Header
        tab={tab}
        onTab={handleTabChange}
        onNavigateCreate={() => handleTabChange('Manage')}
      />

      {/* Konten Utama Aplikasi */}
      <main className="main">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium">Memuat Halaman Sambal...</p>
            </div>
          }
        >
          {tab === 'Catalog' && <Home />}
          {tab === 'Manage' && <Manage />}
          {tab === 'Profile' && <Profile />}
        </Suspense>
      </main>

      {/* Status Offline & Prompt Install PWA */}
      <PWABadge />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App