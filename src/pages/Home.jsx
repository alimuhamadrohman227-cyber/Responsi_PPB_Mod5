import { useEffect, useMemo, useState } from 'react'
import { Heart, X } from 'lucide-react'
import AdvancedFilter from '../components/common/AdvancedFilter'
import { getFavorites, getSambals, toggleFavorite } from '../services/storage'
import { formatPrice, sortItems } from '../utils/helpers'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=500&q=80'

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Terjadi kesalahan yang tidak diketahui.'

export default function Home() {
  const [sambals, setSambals] = useState([])
  const [favorites, setFavorites] = useState([])
  const [search, setSearch] = useState('')
  const [activeLevel, setActiveLevel] = useState('Semua')
  const [sort, setSort] = useState({ key: 'name', order: 'asc' })
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedSambal, setSelectedSambal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadData = async () => {
      setLoading(true)
      try {
        const [loadedSambals, loadedFavorites] = await Promise.all([
          getSambals(),
          Promise.resolve(getFavorites()),
        ])
        if (active) {
          setSambals(loadedSambals)
          setFavorites(loadedFavorites)
          setError('')
        }
      } catch (loadError) {
        if (active) setError(`Gagal memuat katalog: ${getErrorMessage(loadError)}`)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [])

  const filteredSambals = useMemo(() => {
    const filtered = sambals.filter((item) => {
      const matchesName = (item.name || '').toLowerCase().includes(search.toLowerCase())
      const matchesLevel =
        activeLevel === 'Semua' || Number(item.spiciness) === Number(activeLevel.replace('Level ', ''))
      const matchesFavorite =
        !showFavorites || favorites.some((favoriteId) => String(favoriteId) === String(item.id))
      return matchesName && matchesLevel && matchesFavorite
    })
    return sortItems(filtered, sort.key, sort.order)
  }, [sambals, search, activeLevel, showFavorites, favorites, sort])

  const handleToggleFavorite = (id) => {
    try {
      setFavorites(toggleFavorite(id))
    } catch (favoriteError) {
      setError(`Gagal memperbarui favorit: ${getErrorMessage(favoriteError)}`)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-red-50 p-6 rounded-2xl border border-red-100">
        <div>
          <h1 className="text-2xl font-bold text-red-900">Katalog Varian Sambal 🌶️</h1>
          <p className="text-sm text-red-700">Pilih dan jelajahi aneka rasa sambal nusantara &amp; internasional.</p>
        </div>
      </div>

      <AdvancedFilter
        search={search}
        onSearch={setSearch}
        categories={['Semua', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5']}
        activeCategory={activeLevel}
        onCategory={setActiveLevel}
        sortKey={sort.key}
        sortOrder={sort.order}
        onSort={setSort}
      />

      <button
        type="button"
        onClick={() => setShowFavorites((current) => !current)}
        aria-pressed={showFavorites}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
          showFavorites ? 'bg-red-600 text-white' : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
        }`}
      >
        <Heart size={16} fill={showFavorites ? 'currentColor' : 'none'} />
        {showFavorites ? 'Menampilkan Favorit' : 'Tampilkan Favorit'}
      </button>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500" role="status">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
          <p className="text-sm font-medium">Memuat katalog sambal...</p>
        </div>
      ) : filteredSambals.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
          {sambals.length === 0 ? 'Belum ada data sambal di katalog.' : 'Tidak ada sambal yang sesuai dengan filter.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSambals.map((item) => {
            const isFavorite = favorites.some((favoriteId) => String(favoriteId) === String(item.id))
            return (
              <article
                key={item.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.name}
                    className="h-48 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE
                    }}
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                    {'🔥'.repeat(Number(item.spiciness) || 0)} Lv.{item.spiciness}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(item.id)}
                    aria-label={isFavorite ? `Hapus ${item.name} dari favorit` : `Tambah ${item.name} ke favorit`}
                    aria-pressed={isFavorite}
                    className="absolute left-3 top-3 rounded-full bg-white/95 p-2 text-red-600 shadow-sm hover:bg-white"
                  >
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h2 className="mb-1 text-lg font-bold text-gray-800">{item.name}</h2>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">Harga</p>
                      <p className="font-bold text-red-600">{formatPrice(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Stok</p>
                      <p className={`text-sm font-semibold ${Number(item.stock) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {Number(item.stock) > 0 ? `${item.stock} Botol` : 'Habis'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSambal(item)}
                    className="mt-4 w-full rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    Lihat Detail
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {selectedSambal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedSambal(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="sambal-detail-title"
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-56 bg-gray-100">
              <img
                src={selectedSambal.image || FALLBACK_IMAGE}
                alt={selectedSambal.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE
                }}
              />
              <button
                type="button"
                onClick={() => setSelectedSambal(null)}
                aria-label="Tutup detail"
                className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-700 shadow"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 p-6">
              <h2 id="sambal-detail-title" className="text-xl font-bold text-gray-900">{selectedSambal.name}</h2>
              <p className="text-sm leading-6 text-gray-600">{selectedSambal.description || 'Tidak ada deskripsi produk.'}</p>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-sm">
                <span className="font-semibold text-red-600">{formatPrice(selectedSambal.price)}</span>
                <span>Level pedas {selectedSambal.spiciness}</span>
                <span>Stok {selectedSambal.stock}</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
