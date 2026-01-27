'use client'

import { useState, useRef } from 'react'
import { 
  Upload, 
  X,
  Type,
  Palette,
  Eye,
  Image as ImageIcon,
  FileText,
  MessageSquare
} from 'lucide-react'

export default function CreativeReviewer() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
      setShowResults(false)
      
      // Start analyzing
      setIsAnalyzing(true)
      setTimeout(() => {
        setIsAnalyzing(false)
        setShowResults(true)
      }, 2000)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const clearImage = () => {
    setUploadedImage(null)
    setShowResults(false)
    setIsAnalyzing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const overallScore = showResults ? 95 : 0

  const criteriaList = [
    { id: 'fonts', name: 'Lettertypen', icon: <Type className="w-5 h-5" />, feedback: 'Correct gebruik van primaire lettertypen' },
    { id: 'tone', name: 'Tone of Voice', icon: <MessageSquare className="w-5 h-5" />, feedback: 'Toon is correct, maar kan warmer' },
    { id: 'colors', name: 'Kleurgebruik', icon: <Palette className="w-5 h-5" />, feedback: 'Perfect kleurgebruik volgens huisstijl' },
    { id: 'logo', name: 'Logo Plaatsing', icon: <ImageIcon className="w-5 h-5" />, feedback: 'Logo plaatsing moet worden aangepast' },
    { id: 'readability', name: 'Leesbaarheid', icon: <Eye className="w-5 h-5" />, feedback: 'Goede leesbaarheid over het algemeen' },
    { id: 'guidelines', name: 'Merkrichtlijnen', icon: <FileText className="w-5 h-5" />, feedback: 'Grotendeels conform, kleine aanpassingen nodig' }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Upload */}
      <div>
        <h3 className="font-bold text-bt-dark-800 mb-4">Upload Asset</h3>
        <div className="relative h-[500px]">
          {uploadedImage ? (
            <div className="relative h-full bg-bt-gray-100 rounded-bt-lg overflow-hidden border-2 border-bt-gray-200">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-full object-contain"
              />
              <button
                onClick={clearImage}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-bt-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-bt-gray-600" />
              </button>
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-medium">Asset wordt geanalyseerd...</p>
                    <p className="text-sm text-white/70 mt-1">Controle op merkrichtlijnen</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`h-full border-2 border-dashed rounded-bt-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragOver 
                  ? 'border-bt-green-500 bg-bt-green-50' 
                  : 'border-bt-gray-300 hover:border-bt-green-400 hover:bg-bt-gray-50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-16 h-16 text-bt-gray-400 mb-4" />
              <p className="text-bt-gray-600 font-medium">Sleep asset hierheen</p>
              <p className="text-sm text-bt-gray-400 mt-1">of klik om te uploaden</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Results */}
      <div>
        <div className="border border-bt-gray-200 rounded-bt-lg bg-white p-4">
          {/* Overall Score */}
          <div className={`rounded-bt-lg p-4 mb-4 ${showResults ? 'bg-gradient-to-r from-bt-green-500 to-bt-green-600 text-white' : 'bg-bt-gray-100 text-bt-gray-400'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${showResults ? 'text-bt-green-100' : 'text-bt-gray-400'}`}>Totaal Score</p>
                <p className="text-3xl font-bold">{overallScore}%</p>
              </div>
              <p className={`text-sm ${showResults ? 'text-bt-green-100' : 'text-bt-gray-400'}`}>
                {showResults ? 'Uitstekend! Klaar voor publicatie.' : 'Upload een asset om te analyseren'}
              </p>
            </div>
          </div>

          {/* Detailed Analysis */}
          <h3 className="font-semibold text-bt-dark-800 mb-3 text-sm">Gedetailleerde Analyse</h3>
          <div className="space-y-3">
            {criteriaList.map((criteria, index) => (
              <div
                key={criteria.id}
                className={index < criteriaList.length - 1 ? 'pb-3 border-b border-bt-gray-100' : ''}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`${showResults ? 'text-bt-green-500' : 'text-bt-gray-300'}`}>
                    {criteria.icon}
                  </div>
                  <span className={`text-sm font-medium flex-1 ${showResults ? 'text-bt-dark-700' : 'text-bt-gray-400'}`}>{criteria.name}</span>
                  <span className={`text-sm font-bold ${showResults ? 'text-bt-green-600' : 'text-bt-gray-300'}`}>{showResults ? '95%' : '0%'}</span>
                </div>
                <div className="w-full h-1.5 bg-bt-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${showResults ? 'bg-bt-green-500' : 'bg-bt-gray-300'}`}
                    style={{ width: showResults ? '95%' : '0%' }}
                  />
                </div>
                <p className={`text-xs mt-1 ${showResults ? 'text-bt-gray-500' : 'text-bt-gray-400'}`}>{criteria.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
