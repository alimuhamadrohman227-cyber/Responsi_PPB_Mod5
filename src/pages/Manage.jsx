import React, { useRef, useState, useEffect } from 'react'
import { getSambals, addSambal, updateSambal, deleteSambal } from '../services/storage'
import { formatPrice } from '../utils/helpers'
import ConfirmModal from '../components/modals/ConfirmModal'
import { Plus, Edit2, X, Check, ImagePlus, Trash2 } from 'lucide-react'

const emptyForm = {
  name: '',
  spiciness: 3,
  price: '',
  stock: '',
  description: '',
  image: '',
}

const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('File gambar tidak dapat dibaca.'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('File yang dipilih bukan gambar yang valid.'))
      image.onload = () => {
        const scale = Math.min(1, 600 / image.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))

        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('Browser tidak mendukung pemrosesan gambar.'))
          return
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      image.src = reader.result
    }

    reader.readAsDataURL(file)
  })

export default function Manage() {
  const [sambals, setSambals] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [processingImage, setProcessingImage] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState(emptyForm)

  const getErrorMessage = (loadError) =>
    loadError.response?.data?.message || loadError.message || 'Terjadi kesalahan yang tidak diketahui.'

  const loadData = async () => {
    setLoading(true)
    try {
      setSambals(await getSambals())
      setError('')
    } catch (loadError) {
      setError(`Gagal memuat inventaris: ${getErrorMessage(loadError)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    getSambals()
      .then((loadedSambals) => {
        if (active) {
          setSambals(loadedSambals)
          setError('')
        }
      })
      .catch((loadError) => {
        if (active) setError(`Gagal memuat inventaris: ${getErrorMessage(loadError)}`)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (processingImage) {
      setError('Tunggu hingga gambar selesai diproses.')
      return
    }
    if (!formData.name.trim() || formData.price === '' || formData.stock === '') {
      setError('Nama, harga, dan stok wajib diisi.')
      return
    }

    setSaving(true)
    setError('')
    try {
      if (editingId !== null) {
        await updateSambal(editingId, formData)
      } else {
        await addSambal(formData)
      }
      setEditingId(null)
      setFormData(emptyForm)
      if (fileInputRef.current) fileInputRef.current.value = ''
      await loadData()
    } catch (submitError) {
      setError(`Gagal menyimpan sambal: ${getErrorMessage(submitError)}`)
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = async (event) => {
    const [file] = event.target.files || []
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Pilih file gambar dengan format yang didukung.')
      event.target.value = ''
      return
    }

    setProcessingImage(true)
    setError('')
    try {
      const image = await compressImage(file)
      setFormData((current) => ({ ...current, image }))
    } catch (imageError) {
      setError(`Gagal memproses gambar: ${getErrorMessage(imageError)}`)
    } finally {
      setProcessingImage(false)
      event.target.value = ''
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      spiciness: item.spiciness,
      price: item.price,
      stock: item.stock,
      description: item.description || '',
      image: item.image || '',
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const confirmDelete = async () => {
    if (deleteTargetId === null) return

    setDeleting(true)
    setError('')
    try {
      await deleteSambal(deleteTargetId)
      setDeleteTargetId(null)
      await loadData()
    } catch (deleteError) {
      setError(`Gagal menghapus sambal: ${getErrorMessage(deleteError)}`)
    } finally {
      setDeleting(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData(emptyForm)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-8 py-4">
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Form Tambah / Edit */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          {editingId ? <Edit2 size={20} className="text-amber-600" /> : <Plus size={20} className="text-red-600" />}
          <span>{editingId ? 'Edit Varian Sambal' : 'Tambah Varian Sambal Baru'}</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Sambal</label>
            <input
              type="text"
              required
              placeholder="Contoh: Sambal Bawang Pedas"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Level Pedas (1 - 5)</label>
            <select
              value={formData.spiciness}
              onChange={(e) => setFormData({ ...formData, spiciness: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
            >
              {[1, 2, 3, 4, 5].map((lvl) => (
                <option key={lvl} value={lvl}>Level {lvl} {'🔥'.repeat(lvl)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Harga (Rp)</label>
            <input
              type="number"
              required
              placeholder="25000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Stok Botol</label>
            <input
              type="number"
              required
              placeholder="15"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="sambal-image" className="mb-1 block text-xs font-semibold text-gray-600">
              Gambar Produk (Opsional)
            </label>
            <input
              ref={fileInputRef}
              id="sambal-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={processingImage || saving}
              className="sr-only"
            />
            <label
              htmlFor="sambal-image"
              className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-red-200 bg-red-50 px-4 py-5 text-center text-sm text-red-700 transition hover:border-red-400 hover:bg-red-100 ${
                processingImage || saving ? 'cursor-wait opacity-60' : ''
              }`}
            >
              <ImagePlus size={22} />
              <span className="font-semibold">
                {processingImage ? 'Memproses gambar...' : formData.image ? 'Pilih gambar lain untuk mengganti' : 'Pilih gambar dari perangkat'}
              </span>
              <span className="text-xs text-gray-500">Gambar akan diperkecil maksimal 600 px dan disimpan sebagai JPEG.</span>
            </label>

            {formData.image && (
              <div className="mt-3 flex flex-wrap items-start gap-3">
                <img
                  src={formData.image}
                  alt="Preview gambar sambal"
                  className="h-28 w-28 rounded-xl border border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData((current) => ({ ...current, image: '' }))}
                  disabled={saving || processingImage}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                  <Trash2 size={15} /> Hapus gambar
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Deskripsi Produk</label>
            <textarea
              rows="2"
              placeholder="Jelaskan cita rasa dan keunikan sambal..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
            ></textarea>
          </div>

          <div className="md:col-span-2 flex gap-3 justify-end pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium flex items-center gap-1"
              >
                <X size={16} /> Batal
              </button>
            )}
            <button
              type="submit"
              disabled={saving || processingImage}
              className="px-6 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-60 font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Check size={16} /> {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Sambal'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Data Sambal */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Daftar Inventaris Sambal</h2>
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-10 text-sm text-gray-500" role="status">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
            Memuat inventaris...
          </div>
        ) : sambals.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">Belum ada data sambal di inventaris.</p>
        ) : (
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-3 px-3">Produk</th>
              <th className="py-3 px-3">Kepedasan</th>
              <th className="py-3 px-3">Harga</th>
              <th className="py-3 px-3">Stok</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sambals.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 font-semibold text-gray-800 flex items-center gap-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=100&q=80'}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                  />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-400 font-normal line-clamp-1">{item.description}</div>
                  </div>
                </td>
                <td className="py-3 px-3 font-medium">Lv. {item.spiciness}</td>
                <td className="py-3 px-3 font-medium text-red-600">{formatPrice(item.price)}</td>
                <td className="py-3 px-3 font-medium">{item.stock} botol</td>
                <td className="py-3 px-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs rounded-xl font-semibold hover:bg-amber-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-xl font-semibold hover:bg-red-200 transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        open={deleteTargetId !== null}
        title="Hapus Sambal"
        message="Apakah Anda yakin ingin menghapus varian sambal ini dari katalog?"
        confirmText="Hapus"
        cancelText="Batal"
        danger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={deleting}
      />
    </div>
  )
}