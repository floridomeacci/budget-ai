'use client'

import { useState } from 'react'
import { 
  User, 
  Sparkles, 
  RefreshCw, 
  Download, 
  Check,
  ImageIcon
} from 'lucide-react'
import { useAssets } from '@/context/AssetContext'

interface Actor {
  id: string
  name: string
  image: string
}

interface GeneratedImage {
  id: string
  imageUrl: string
}

const actors: Actor[] = [
  { id: '1', name: 'Sophie', image: '/images/characters/sophie.webp' },
  { id: '2', name: 'Daan', image: '/images/characters/daan.webp' },
  { id: '3', name: 'Emma', image: '/images/characters/emma.webp' },
  { id: '4', name: 'Bas', image: '/images/characters/bas.webp' },
  { id: '5', name: 'Linda', image: '/images/characters/linda.webp' },
  { id: '6', name: 'Kevin', image: '/images/characters/kevin.webp' },
  { id: '7', name: 'Dylan', image: '/images/characters/dylan.webp' },
  { id: '8', name: 'Max', image: '/images/characters/max.webp' },
  { id: '9', name: 'Yanti', image: '/images/characters/yanti.webp' },
]

export default function CreatePhoto() {
  const { addAsset } = useAssets()
  const [selectedActor, setSelectedActor] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedActorData = actors.find(a => a.id === selectedActor)

  const handleGenerate = async () => {
    if (!selectedActor || !prompt.trim() || !selectedActorData) return
    
    setIsGenerating(true)
    setSelectedImage(null)
    setGeneratedImages([])
    setError(null)

    try {
      // Fetch the actor image and convert to base64
      const imageResponse = await fetch(selectedActorData.image)
      const imageBlob = await imageResponse.blob()
      const imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(imageBlob)
      })

      // Call the API
      const response = await fetch('/api/create-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${selectedActorData.name}: ${prompt}`,
          imageBase64,
          aspectRatio: '1:1',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate images')
      }

      const newImages: GeneratedImage[] = data.outputUrls.map((url: string, i: number) => ({
        id: `${Date.now()}-${i}`,
        imageUrl: url,
      }))
      
      setGeneratedImages(newImages)
      setSelectedImage(newImages[0]?.id || null)
      
      // Add all generated images to asset library
      newImages.forEach((img: GeneratedImage) => {
        addAsset({
          url: img.imageUrl,
          type: 'create',
          label: 'yellow',
          prompt: prompt,
          actor: selectedActorData?.name
        })
      })
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate images')
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedImageData = generatedImages.find(img => img.id === selectedImage)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Controls */}
      <div className="card space-y-6">
        {/* Actor Selection */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-bt-green-100 rounded-bt flex items-center justify-center">
              <User className="w-5 h-5 text-bt-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-bt-dark-800">Kies een Actor</h2>
              <p className="text-sm text-bt-gray-500">Selecteer een persona voor je afbeelding</p>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
            {actors.map((actor) => (
              <button
                key={actor.id}
                onClick={() => setSelectedActor(actor.id)}
                className={`rounded-bt-lg border-2 transition-all duration-200 overflow-hidden ${
                  selectedActor === actor.id
                    ? 'border-bt-green-500'
                    : 'border-bt-gray-200 hover:border-bt-green-300'
                }`}
              >
                <div className="aspect-square relative">
                  <img 
                    src={actor.image} 
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                    <p className="font-medium text-white text-sm text-center">{actor.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-bt-green-100 rounded-bt flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-bt-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-bt-dark-800">Beschrijf de Scène</h2>
              <p className="text-sm text-bt-gray-500">Geef een beschrijving van de gewenste actie</p>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschrijf de actie, locatie en sfeer..."
              className="input-field min-h-[100px] resize-none"
            />

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!selectedActor || !prompt.trim() || isGenerating}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Bezig met genereren...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Genereer 4 Opties
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-bt p-3 text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Results */}
      <div className="card">
        <h3 className="font-bold text-bt-dark-800 mb-4">Resultaat</h3>

        {/* Main Image with Options Overlay */}
        <div className="relative">
          {/* Main Selected Image */}
          <div className="aspect-square bg-bt-gray-100 rounded-bt-lg overflow-hidden relative">
            {isGenerating ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="w-12 h-12 text-bt-gray-300 animate-spin mx-auto" />
                  <p className="text-sm text-bt-gray-500 mt-3">Bezig met genereren...</p>
                </div>
              </div>
            ) : selectedImageData ? (
              <>
                <img 
                  src={selectedImageData.imageUrl} 
                  alt="Generated" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <a 
                    href={selectedImageData.imageUrl} 
                    download 
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-bt-green-50"
                  >
                    <Download className="w-5 h-5 text-bt-dark-700" />
                  </a>
                  <button className="p-3 bg-bt-green-500 rounded-full shadow-lg hover:bg-bt-green-600">
                    <Check className="w-5 h-5 text-white" />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 text-bt-gray-300 mx-auto mb-4" />
                  <p className="text-bt-gray-500">Nog geen afbeelding</p>
                  <p className="text-sm text-bt-gray-400 mt-1">Selecteer een actor en beschrijf de scène</p>
                </div>
              </div>
            )}
          </div>

          {/* 4 Options - Stacked vertically on top right */}
          {(generatedImages.length > 0 || isGenerating) && (
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {isGenerating ? (
                // Generating placeholders
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 bg-bt-gray-200 rounded-bt-lg animate-pulse border-2 border-white shadow-lg"
                  />
                ))
              ) : (
                generatedImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.id)}
                    className={`w-16 h-16 rounded-bt-lg overflow-hidden border-2 shadow-lg transition-all ${
                      selectedImage === img.id
                        ? 'border-bt-green-500 ring-2 ring-bt-green-300'
                        : 'border-white hover:border-bt-green-300'
                    }`}
                  >
                    <img 
                      src={img.imageUrl} 
                      alt="Generated option" 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
