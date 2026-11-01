'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon } from 'lucide-react'

type Props = {
  currentUrl: string
  onUploaded: (url: string) => void
}

export default function ImageUploader({ currentUrl, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(currentUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  async function handleFile(file: File) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Hanya file JPG, PNG, atau WebP.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file maksimal 2MB.')
      return
    }

    // Tampilkan preview lokal dulu
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        onUploaded(data.url)
      } else {
        setError(data.error || 'Upload gagal.')
        setPreview(currentUrl) // rollback preview
      }
    } catch {
      setError('Terjadi kesalahan saat upload.')
      setPreview(currentUrl)
    } finally {
      setUploading(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleClear() {
    setPreview('')
    onUploaded('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Preview area / drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed cursor-pointer transition-colors
          ${dragOver ? 'border-yellow-400 bg-yellow-50' : 'border-yellow-300 bg-yellow-50 hover:border-yellow-400 hover:bg-yellow-100'}`}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview gambar menu"
              fill
              className="object-cover"
              sizes="400px"
              unoptimized={preview.startsWith('blob:')}
            />
            {/* Overlay saat upload */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-xs font-medium">Mengupload...</p>
              </div>
            )}
            {/* Overlay saat hover (bukan uploading) */}
            {!uploading && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                <div className="bg-white/90 rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Upload size={16} />
                  Ganti Gambar
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageIcon size={36} className="text-yellow-300" />
            <p className="text-sm font-medium text-gray-500">Klik atau drag & drop gambar</p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP - Maks. 2MB</p>
          </div>
        )}
      </div>

      {/* Input file (hidden) */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Action row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-sm text-yellow-700 bg-yellow-100 hover:bg-yellow-200 disabled:opacity-50 px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          <Upload size={14} />
          {uploading ? 'Mengupload...' : 'Pilih File'}
        </button>

        {preview && !uploading && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            <X size={14} />
            Hapus
          </button>
        )}

        <span className="text-xs text-gray-400 ml-auto">JPG, PNG, WebP · Maks 2MB</span>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
