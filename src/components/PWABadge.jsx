import { useState, useEffect } from 'react'
import { Download, WifiOff, X } from 'lucide-react'

/**
 * PWABadge — Prompt install PWA & indikator status jaringan offline/online.
 */
export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
    }

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setInstallPrompt(null)
  }

  if (dismissed) return null

  // Banner Status Offline
  if (isOffline) {
    return (
      <aside className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 bg-amber-900 text-amber-100 px-4 py-3 rounded-2xl shadow-lg border border-amber-700 flex items-center gap-3 text-sm font-medium" role="status" aria-live="polite">
        <WifiOff size={18} className="text-amber-400 shrink-0" />
        <span>Modus Offline Aktif. Data katalog sambal tetap dapat diakses.</span>
      </aside>
    )
  }

  // Banner Install PWA
  if (installPrompt && !installed) {
    return (
      <aside className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 bg-white text-gray-800 p-4 rounded-2xl shadow-2xl border border-red-100 flex items-center justify-between gap-4 max-w-md" role="region" aria-label="Install Aplikasi">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Download size={18} />
          </div>
          <span className="text-xs sm:text-sm">
            Pasang <strong>Sambal Catalog PWA</strong> untuk akses cepat tanpa internet.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            onClick={handleInstallClick}
          >
            Install
          </button>
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
            onClick={() => setDismissed(true)}
            aria-label="Tutup banner"
          >
            <X size={16} />
          </button>
        </div>
      </aside>
    )
  }

  return null
}