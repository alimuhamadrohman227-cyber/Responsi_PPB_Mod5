// ---------------------------------------------------------------------------
// helpers.js — Pure utility functions untuk Sambal Catalog PWA
// ---------------------------------------------------------------------------

/**
 * Format harga angka ke format Rupiah Indonesia (contoh: "Rp 25.000").
 */
export const formatPrice = (price) => {
  const num = Number(price)
  if (Number.isNaN(num)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Pencarian teks client-side (nama & deskripsi sambal).
 */
export const matchesSearch = (item, query) => {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    (item.name || '').toLowerCase().includes(q) ||
    (item.description || '').toLowerCase().includes(q)
  )
}

/**
 * Filter kategori berdasarkan level pedas / tipe sambal.
 */
export const matchesCategory = (item, category) => {
  if (!category || category === 'Semua' || category === 'All') return true
  if (category.startsWith('Level ')) {
    const level = Number(category.replace('Level ', ''))
    return Number(item.spiciness) === level
  }
  return (item.category || '').toLowerCase() === category.toLowerCase()
}

/**
 * Sorting item sambal berdasarkan nama, harga, atau level pedas.
 */
export const sortItems = (items, key = 'name', order = 'asc') => {
  const sorted = [...items].sort((a, b) => {
    if (key === 'price') return (Number(a.price) || 0) - (Number(b.price) || 0)
    if (key === 'spiciness') return (Number(a.spiciness) || 0) - (Number(b.spiciness) || 0)
    return String(a[key] || '').localeCompare(String(b[key] || ''))
  })
  return order === 'desc' ? sorted.reverse() : sorted
}

/**
 * Pemotong teks deskripsi panjang.
 */
export const truncate = (str, max = 100) => {
  if (!str || str.length <= max) return str || ''
  return str.slice(0, max).trimEnd() + '…'
}