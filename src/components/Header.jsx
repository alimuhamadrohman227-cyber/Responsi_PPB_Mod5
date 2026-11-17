import { Plus } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'Catalog', label: 'Katalog' },
  { id: 'Manage', label: 'Kelola' },
  { id: 'Profile', label: 'Profil' },
]

function Header({ tab, onTab, onNavigateCreate }) {
  return (
    <header className="bg-red-600 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onTab && onTab('Catalog')}
        >
          <span className="text-2xl">🌶️</span>
          <span className="text-xl font-bold tracking-wide">Sambal Catalog</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                tab === item.id ? 'bg-red-800 text-white' : 'hover:bg-red-700 text-red-50'
              }`}
              onClick={() => onTab && onTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        {onNavigateCreate && (
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-700 rounded-xl text-xs font-bold hover:bg-red-50 transition shadow-sm"
            onClick={onNavigateCreate}
            title="Tambah Varian Sambal Baru"
          >
            <Plus size={15} /> Tambah Sambal
          </button>
        )}
      </div>
    </header>
  )
}

export default Header