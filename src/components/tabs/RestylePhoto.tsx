'use client'

import { useState, useCallback } from 'react'
import { 
  Upload, 
  Sparkles, 
  X
} from 'lucide-react'

export default function RestylePhoto() {
  const [dragOver, setDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return

    // Convert to base64
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      setCurrentImage(base64)
      
      // Start processing immediately
      setResultImage(null)
      setIsProcessing(true)
      setError(null)

      try {
        // Send base64 directly to API
        const response = await fetch('/api/restyle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageBase64: base64,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to process image')
        }

        setResultImage(data.outputUrl)
      } catch (err) {
        console.error('Processing error:', err)
        setError(err instanceof Error ? err.message : 'Failed to process image')
      } finally {
        setIsProcessing(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setCurrentImage(null)
    setResultImage(null)
    setError(null)
  }

  // Determine which image to display
  const displayImage = resultImage || currentImage

  return (
    <div className="space-y-8">
      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload Section */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-bt-green-100 rounded-bt flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-bt-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-bt-dark-800">Restyle naar BudgetThuis Stijl</h2>
              <p className="text-sm text-bt-gray-500">Upload een foto en transformeer deze naar onze huisstijl</p>
            </div>
          </div>

          {!displayImage ? (
            <div
              className={`file-upload-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-bt-green-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-bt-green-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-bt-dark-700">
                      Sleep je afbeelding hierheen
                    </p>
                    <p className="text-sm text-bt-gray-500 mt-1">
                      of <span className="text-bt-green-500 font-medium">klik om te uploaden</span>
                    </p>
                  </div>
                  <p className="text-xs text-bt-gray-400">
                    Ondersteunde formaten: JPG, PNG, WEBP (max. 10MB)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="relative">
              {/* Clear button */}
              <button
                onClick={clearImage}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-bt-dark-700" />
              </button>

              {/* Image container */}
              <div className="aspect-video bg-bt-gray-100 rounded-bt-lg overflow-hidden relative">
                <img
                  src={displayImage}
                  alt="Photo"
                  className={`w-full h-full object-contain transition-opacity ${isProcessing ? 'opacity-50' : 'opacity-100'}`}
                />
                
                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-white rounded-bt-lg p-6 shadow-lg flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-bt-green-200 border-t-bt-green-500 rounded-full animate-spin" />
                      <p className="text-sm font-medium text-bt-dark-700">Bezig met transformeren...</p>
                    </div>
                  </div>
                )}

                {/* Result badge */}
                {resultImage && !isProcessing && (
                  <div className="absolute bottom-3 left-3 bg-bt-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    BudgetThuis Stijl
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-bt p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Before/After Example */}
        <div className="relative py-4 px-4 pb-24">
          {/* Before Image */}
          <div className="relative z-10">
            <img
              src="/images/before.webp"
              alt="Before - Original"
              className="w-full max-w-[320px] h-auto rounded-bt-lg shadow-bt border-4 border-white"
            />
            <div className="absolute top-3 left-3 bg-bt-dark-800 text-white text-xs font-bold px-3 py-1 rounded-full">
              VOOR
            </div>
          </div>

          {/* After Image - Overlapping bottom right */}
          <div className="absolute -bottom-[28px] right-0 z-20">
            <img
              src="/images/after.webp"
              alt="After - BudgetThuis Style"
              className="w-full max-w-[280px] h-auto rounded-bt-lg shadow-bt-lg border-4 border-bt-green-500"
            />
            <div className="absolute top-3 left-3 bg-bt-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              NA
            </div>
          </div>
        </div>
      </div>

      <div className="h-10"></div>

      {/* Photography Style Guide */}
      <div className="card bg-bt-green-50 border border-bt-green-100">
        <h3 className="font-bold text-bt-green-800 mb-3">BudgetThuis Fotografie Stijl</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-bt-green-700">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-bt-green-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-bt-green-700">1</span>
            </div>
            <div>
              <p className="font-medium">Warm & Natuurlijk</p>
              <p className="text-bt-green-600 text-xs mt-1">Heldere, natuurlijke belichting met warme tinten</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-bt-green-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-bt-green-700">2</span>
            </div>
            <div>
              <p className="font-medium">Authentiek</p>
              <p className="text-bt-green-600 text-xs mt-1">Echte mensen in echte situaties</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-bt-green-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-bt-green-700">3</span>
            </div>
            <div>
              <p className="font-medium">Groen Accent</p>
              <p className="text-bt-green-600 text-xs mt-1">Subtiele groene elementen voor merkherkenning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
