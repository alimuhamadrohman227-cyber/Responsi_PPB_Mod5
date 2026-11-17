import { Search, SlidersHorizontal } from 'lucide-react'

/**
 * Filter pencarian, kategori level pedas, dan urutan harga sambal.
 *
 * @param {Object}   props
 * @param {string}   props.search        — query pencarian
 * @param {Function} props.onSearch      — (value) => void
 * @param {string[]} props.categories    — e.g. ['Semua', 'Level 1-2', 'Level 3-4', 'Level 5']
 * @param {string}   props.activeCategory
 * @param {Function} props.onCategory    — (value) => void
 * @param {string}   props.sortKey       — 'name' | 'price' | 'spiciness'
 * @param {string}   props.sortOrder     — 'asc' | 'desc'
 * @param {Function} props.onSort        — ({ key, order }) => void
 */
export default function AdvancedFilter({
  search,
  onSearch,
  categories = ['Semua'],
  activeCategory = 'Semua',
  onCategory,
  sortKey,
  sortOrder,
  onSort,
}) {
  return (
    <div className="adv-filter flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
      {/* Search Input */}
      <div className="adv-filter__search relative w-full md:w-72">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Cari sambal..."
          value={search}
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Cari sambal"
        />
      </div>

      {/* Category Pills */}
      {categories && categories.length > 1 && (
        <div className="adv-filter__pills flex gap-2 overflow-x-auto w-full md:w-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => onCategory && onCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Sort Dropdown */}
      <div className="adv-filter__sort flex items-center gap-2 w-full md:w-auto">
        <SlidersHorizontal size={14} className="text-gray-500" />
        <select
          value={`${sortKey}_${sortOrder}`}
          onChange={(e) => {
            const [key, order] = e.target.value.split('_')
            if (onSort) onSort({ key, order })
          }}
          aria-label="Urutkan katalog sambal"
          className="w-full md:w-auto px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 font-medium"
        >
          <option value="name_asc">Nama (A → Z)</option>
          <option value="name_desc">Nama (Z → A)</option>
          <option value="price_asc">Harga (Termurah)</option>
          <option value="price_desc">Harga (Termahal)</option>
          <option value="spiciness_desc">Tingkat Pedas (Tertinggi)</option>
        </select>
      </div>
    </div>
  )
}