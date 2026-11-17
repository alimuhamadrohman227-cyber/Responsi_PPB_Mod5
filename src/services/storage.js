import axios from 'axios'

const SAMBALS_CACHE_KEY = 'sambal_cache'
const FAVORITES_KEY = 'sambal_favorites'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const sambalsApi = axios.create({
  baseURL: `${supabaseUrl}/rest/v1/sambals`,
  headers: {
    apikey: publishableKey,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  },
})

const ensureSupabaseConfig = () => {
  if (!supabaseUrl || !publishableKey) {
    throw new Error('Konfigurasi Supabase belum lengkap. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.')
  }
}

const getApiErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.details ||
  error.message ||
  'Kesalahan tidak diketahui.'

const readSambalsCache = () => {
  const cachedData = localStorage.getItem(SAMBALS_CACHE_KEY)
  if (cachedData === null) return null

  const sambals = JSON.parse(cachedData)
  if (!Array.isArray(sambals)) {
    throw new Error('Cache katalog sambal tidak valid.')
  }
  return sambals
}

const writeSambalsCache = (sambals) => {
  localStorage.setItem(SAMBALS_CACHE_KEY, JSON.stringify(sambals))
}

const getMutationRows = (responseData) =>
  Array.isArray(responseData) ? responseData : responseData ? [responseData] : []

const updateCachedSambals = (update) => {
  const cachedSambals = readSambalsCache()
  if (cachedSambals !== null) writeSambalsCache(update(cachedSambals))
}

const normalizePayload = (data) => ({
  name: data.name.trim(),
  spiciness: Number(data.spiciness),
  price: Number(data.price),
  stock: Number(data.stock),
  description: data.description || '',
  image: data.image || '',
})

export const getSambals = async () => {
  let response
  try {
    ensureSupabaseConfig()
    response = await sambalsApi.get('', {
      params: { select: '*', order: 'id.asc' },
    })
  } catch (error) {
    let cachedSambals
    try {
      cachedSambals = readSambalsCache()
    } catch (cacheError) {
      throw new Error(`Gagal mengambil katalog dari Supabase (${getApiErrorMessage(error)}). ${cacheError.message}`)
    }

    if (cachedSambals !== null) return cachedSambals
    throw new Error(`Gagal mengambil katalog dari Supabase: ${getApiErrorMessage(error)}`)
  }

  writeSambalsCache(response.data)
  return response.data
}

export const addSambal = async (data) => {
  ensureSupabaseConfig()
  const response = await sambalsApi.post('', normalizePayload(data))
  const addedSambals = getMutationRows(response.data)
  if (addedSambals.length > 0) {
    updateCachedSambals((sambals) =>
      [...sambals, ...addedSambals].sort((a, b) => Number(a.id) - Number(b.id)),
    )
  }
  return addedSambals
}

export const updateSambal = async (id, data) => {
  ensureSupabaseConfig()
  const response = await sambalsApi.patch('', normalizePayload(data), {
    params: { id: `eq.${id}` },
  })
  const updatedSambals = getMutationRows(response.data)
  if (updatedSambals.length > 0) {
    const updatedById = new Map(updatedSambals.map((sambal) => [String(sambal.id), sambal]))
    updateCachedSambals((sambals) =>
      sambals.map((sambal) => updatedById.get(String(sambal.id)) || sambal),
    )
  }
  return updatedSambals
}

export const deleteSambal = async (id) => {
  ensureSupabaseConfig()
  const response = await sambalsApi.delete('', {
    params: { id: `eq.${id}` },
  })
  updateCachedSambals((sambals) =>
    sambals.filter((sambal) => String(sambal.id) !== String(id)),
  )
  return getMutationRows(response.data)
}

export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY)
  if (favorites === null) return []

  const parsedFavorites = JSON.parse(favorites)
  if (!Array.isArray(parsedFavorites)) {
    throw new Error('Data favorit sambal tidak valid.')
  }
  return parsedFavorites
}

export const toggleFavorite = (id) => {
  const favorites = getFavorites()
  const isFavorite = favorites.some((favoriteId) => String(favoriteId) === String(id))
  const updatedFavorites = isFavorite
    ? favorites.filter((favoriteId) => String(favoriteId) !== String(id))
    : [...favorites, id]

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
  return updatedFavorites
}
