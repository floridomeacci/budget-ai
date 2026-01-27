'use client'

import { useState } from 'react'
import { 
  User, 
  Video, 
  Play,
  RefreshCw,
  Download,
  Check,
  Sparkles,
  X,
  Package
} from 'lucide-react'
import { useAssets } from '@/context/AssetContext'

interface Actor {
  id: string
  name: string
  image: string
}

interface Product {
  id: string
  name: string
  image: string
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

const products: Product[] = [
  { id: '1', name: 'Draytek Router', image: '/images/products/BA1_Beeld_Artikelblok_Dreytek_2023M12_V1.png' },
  { id: '2', name: 'Vigor Router', image: '/images/products/BA_AB_Beeld_Artikelblok_Vigor_2024M01.png' },
  { id: '3', name: 'Modem V10', image: '/images/products/Modem_V10_Groen-01.png' },
  { id: '4', name: 'Experia Box', image: '/images/products/experiaboxV10a.png' },
]

export default function UGCVideoCreator() {
  const { addAsset } = useAssets()
  const [selectedActor, setSelectedActor] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [script, setScript] = useState('Oké maar serieus, sinds ik deze router heb... geen buffering meer! Mijn hele huis heeft nu perfect wifi. BudgetThuis, eindelijk iemand die het snapt.')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedActorData = actors.find(a => a.id === selectedActor)
  const selectedProductData = products.find(p => p.id === selectedProduct)

  const handleGenerate = async () => {
    if (!selectedActor || !selectedProduct || !selectedActorData || !selectedProductData) return
    
    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      // Fetch actor image and convert to base64
      const actorResponse = await fetch(selectedActorData.image)
      const actorBlob = await actorResponse.blob()
      const actorBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(actorBlob)
      })

      // Fetch product image and convert to base64
      const productResponse = await fetch(selectedProductData.image)
      const productBlob = await productResponse.blob()
      const productBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(productBlob)
      })

      // Call the API
      const response = await fetch('/api/create-ugc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actorName: selectedActorData.name,
          productName: selectedProductData.name,
          actorImageBase64: actorBase64,
          productImageBase64: productBase64,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate UGC image')
      }

      setGeneratedImage(data.outputUrl)
      
      // Add to asset library
      addAsset({
        url: data.outputUrl,
        type: 'ugc',
        label: 'yellow',
        actor: selectedActorData?.name,
        product: selectedProductData?.name
      })
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateVideo = async () => {
    if (!generatedImage || !script.trim()) return
    
    setIsGeneratingVideo(true)
    setGeneratedVideo(null)

    try {
      const response = await fetch('/api/create-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${selectedActorData?.name || 'Person'} presenting ${selectedProductData?.name || 'product'}: ${script}`,
          referenceImageUrl: generatedImage,
          duration: 8,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video')
      }

      setGeneratedVideo(data.outputUrl)
    } catch (err) {
      console.error('Video generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate video')
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  const clearImage = () => {
    setGeneratedImage(null)
    setGeneratedVideo(null)
    setSelectedActor(null)
    setSelectedProduct(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Column - Controls (2/4 = 1/2) */}
      <div className="lg:col-span-2 card space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-bt-green-100 rounded-bt flex items-center justify-center">
            <User className="w-5 h-5 text-bt-green-600" />
          </div>
          <h2 className="text-lg font-bold text-bt-dark-800">Stap 1: Components</h2>
        </div>

        {/* Actor Selection */}
        <div>
          <p className="text-sm font-medium text-bt-dark-700 mb-3">Selecteer een actor</p>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
            {actors.map((actor) => (
              <button
                key={actor.id}
                onClick={() => setSelectedActor(actor.id)}
                className={`rounded-bt-lg transition-all duration-200 overflow-hidden ${
                  selectedActor === actor.id
                    ? 'ring-4 ring-black border-2 border-black'
                    : 'border-2 border-bt-gray-200 hover:border-bt-green-300'
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

        {/* Product Selection */}
        <div>
          <p className="text-sm font-medium text-bt-dark-700 mb-3">Selecteer een product</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`rounded-bt-lg transition-all duration-200 overflow-hidden ${
                  selectedProduct === product.id
                    ? 'ring-4 ring-black border-2 border-black'
                    : 'border-2 border-bt-gray-200 hover:border-bt-green-300'
                }`}
              >
                <div className="aspect-square relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                    <p className="font-medium text-white text-sm text-center">{product.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Column - Preview (1/4) */}
      <div className="lg:col-span-1">
        <div className="card h-full flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-bt-green-100 rounded-bt flex items-center justify-center">
              <Video className="w-4 h-4 text-bt-green-600" />
            </div>
            <h3 className="font-bold text-bt-dark-800 text-sm">Stap 2: Start frame</h3>
          </div>
          
          {/* Video Preview - 9:16 aspect ratio */}
          <div className="relative bg-bt-gray-100 rounded-bt-lg overflow-hidden border-2 border-bt-gray-200 flex-1 min-h-[400px]">
            {isGenerating ? (
              <div className="absolute inset-0 bg-bt-dark-800 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-bt-green-200 border-t-bt-green-500 rounded-full animate-spin mb-3" />
                <p className="font-medium text-sm">Genereren...</p>
                <p className="text-xs text-bt-gray-400 mt-1">Even geduld</p>
              </div>
            ) : generatedImage ? (
              <>
                <img
                  src={generatedImage}
                  alt="Generated UGC"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Play className="w-6 h-6 text-bt-green-600 ml-0.5" />
                  </button>
                </div>
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg hover:bg-bt-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-bt-gray-600" />
                </button>
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button className="p-1.5 bg-white rounded-bt shadow-lg hover:bg-bt-gray-100 transition-colors">
                    <Download className="w-4 h-4 text-bt-gray-600" />
                  </button>
                  <button className="p-1.5 bg-bt-green-500 rounded-bt shadow-lg hover:bg-bt-green-600 transition-colors">
                    <Check className="w-4 h-4 text-white" />
                  </button>
                </div>
              </>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-4">
                <X className="w-10 h-10 mb-2" />
                <p className="text-xs text-center">{error}</p>
                <button
                  onClick={handleGenerate}
                  className="mt-3 text-xs text-bt-green-600 hover:text-bt-green-700"
                >
                  Opnieuw
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-bt-gray-400">
                <Video className="w-10 h-10 mb-2" />
                <p className="text-bt-gray-500 text-xs">9:16 Preview</p>
                <p className="text-xs text-bt-gray-400 mt-1">Selecteer actor & product</p>
              </div>
            )}
          </div>
          
          {/* Generate Image Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedActor || !selectedProduct || isGenerating}
            className={`w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2 mt-4 rounded-bt font-medium transition-colors ${
              generatedImage 
                ? 'bg-bt-gray-200 text-bt-gray-600 hover:bg-bt-gray-300' 
                : 'btn-primary'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Genereren...
              </>
            ) : generatedImage ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Try New
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Genereer Afbeelding
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column - Script (1/4) */}
      <div className="lg:col-span-1">
        <div className="card h-full flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-bt-green-100 rounded-bt flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-bt-green-600" />
            </div>
            <h3 className="font-bold text-bt-dark-800 text-sm">Stap 3: Genereer video</h3>
          </div>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Schrijf hier je videoscript..."
            className="input-field flex-1 min-h-[200px] resize-none text-sm"
          />
          <p className="text-xs text-bt-gray-400 mt-2 mb-4">
            ±{Math.max(1, Math.round(script.split(' ').filter(w => w).length * 0.4))} sec
          </p>
          <button
            onClick={handleGenerateVideo}
            disabled={!generatedImage || !script.trim() || isGeneratingVideo}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2"
          >
            {isGeneratingVideo ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Genereren... (±2-5 min)
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                Genereer Video (8 sec)
              </>
            )}
          </button>
          
          {generatedVideo && (
            <div className="mt-4 p-3 bg-bt-green-50 rounded-bt border border-bt-green-200">
              <p className="text-xs text-bt-green-700 font-medium mb-2">Video gegenereerd!</p>
              <a 
                href={generatedVideo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-bt-green-600 underline hover:text-bt-green-700"
              >
                Download video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
