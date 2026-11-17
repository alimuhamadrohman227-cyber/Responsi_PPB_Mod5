import { AlertTriangle } from 'lucide-react'

/**
 * Modal konfirmasi reusable untuk aksi hapus / update data sambal.
 */
export default function ConfirmModal({
  open,
  isOpen,
  title = "Konfirmasi Aksi",
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmLabel,
  confirmText,
  cancelLabel,
  cancelText,
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
  onClose,
}) {
  const isVisible = open ?? isOpen ?? false
  const handleCancel = onCancel || onClose
  const actualConfirmText = confirmLabel || confirmText || 'Konfirmasi'
  const actualCancelText = cancelLabel || cancelText || 'Batal'

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleCancel}>
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-msg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${danger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
          <AlertTriangle size={28} />
        </div>
        
        <h3 id="confirm-title" className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h3>
        <p id="confirm-msg" className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex gap-3 w-full justify-end">
          <button
            type="button"
            className="flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            onClick={handleCancel}
            disabled={loading}
          >
            {actualCancelText}
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl text-white shadow-sm transition ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Memproses…' : actualConfirmText}
          </button>
        </div>
      </div>
    </div>
  )
}