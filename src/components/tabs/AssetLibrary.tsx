'use client'

import { useState } from 'react'
import { 
  Search, 
  Trash2,
  Download,
  Image as ImageIcon,
  Video,
  Camera,
  ImagePlus
} from 'lucide-react'
import { useAssets, Asset } from '@/context/AssetContext'

type FilterType = 'all' | 'restyle' | 'create' | 'ugc'
type FilterLabel = 'all' | 'red' | 'yellow' | 'green'

export default function AssetLibrary() {
  const { assets, updateAssetLabel, deleteAsset } = useAssets()
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterLabel, setFilterLabel] = useState<FilterLabel>('all')
  const [search, setSearch] = useState('')

  const filteredAssets = assets.filter(asset => {
    if (filterType !== 'all' && asset.type !== filterType) return false
    if (filterLabel !== 'all' && asset.label !== filterLabel) return false
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        asset.prompt?.toLowerCase().includes(searchLower) ||
        asset.actor?.toLowerCase().includes(searchLower) ||
        asset.product?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const getTypeIcon = (type: Asset['type']) => {
    switch (type) {
      case 'restyle': return <Camera className="w-3 h-3" />
      case 'create': return <ImagePlus className="w-3 h-3" />
      case 'ugc': return <Video className="w-3 h-3" />
    }
  }

  const getTypeLabel = (type: Asset['type']) => {
    switch (type) {
      case 'restyle': return 'Restyle'
      case 'create': return 'Create'
      case 'ugc': return 'UGC'
    }
  }

  const getLabelColor = (label: Asset['label']) => {
    switch (label) {
      case 'green': return 'bg-green-500'
      case 'yellow': return 'bg-yellow-500'
      case 'red': return 'bg-red-500'
    }
  }

  const handleDownload = async (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `budgetthuis-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bt-gray-400" />
            <input
              type="text"
              placeholder="Zoeken..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-bt-gray-500">Type:</span>
            <div className="flex gap-1">
              {(['all', 'restyle', 'create', 'ugc'] as FilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-bt transition-colors ${
                    filterType === type
                      ? 'bg-bt-green-500 text-white'
                      : 'bg-bt-gray-100 text-bt-gray-600 hover:bg-bt-gray-200'
                  }`}
                >
                  {type === 'all' ? 'Alle' : getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Label filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-bt-gray-500">Label:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setFilterLabel('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-bt transition-colors ${
                  filterLabel === 'all'
                    ? 'bg-bt-green-500 text-white'
                    : 'bg-bt-gray-100 text-bt-gray-600 hover:bg-bt-gray-200'
                }`}
              >
                Alle
              </button>
              {(['green', 'yellow', 'red'] as const).map((label) => (
                <button
                  key={label}
                  onClick={() => setFilterLabel(label)}
                  className={`w-8 h-8 rounded-bt flex items-center justify-center transition-all ${
                    filterLabel === label
                      ? 'ring-2 ring-offset-2 ring-bt-dark-800'
                      : 'hover:opacity-80'
                  } ${getLabelColor(label)}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-bt-gray-500">
        <span>{filteredAssets.length} assets</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {assets.filter(a => a.label === 'green').length} goedgekeurd
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          {assets.filter(a => a.label === 'yellow').length} review
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          {assets.filter(a => a.label === 'red').length} afgekeurd
        </span>
      </div>

      {/* Masonry Grid */}
      {filteredAssets.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="break-inside-avoid bg-white rounded-bt-lg overflow-hidden shadow-bt border border-bt-gray-200 group"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={asset.url}
                  alt=""
                  className="w-full h-auto"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDownload(asset.url)}
                    className="p-2 bg-white rounded-full hover:bg-bt-gray-100 transition-colors"
                  >
                    <Download className="w-4 h-4 text-bt-dark-800" />
                  </button>
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* Type badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs flex items-center gap-1">
                  {getTypeIcon(asset.type)}
                  {getTypeLabel(asset.type)}
                </div>

                {/* Label indicator */}
                <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${getLabelColor(asset.label)} border-2 border-white shadow`} />
              </div>

              {/* Footer */}
              <div className="p-3">
                {/* Label buttons */}
                <div className="flex gap-2 mb-2">
                  {(['green', 'yellow', 'red'] as const).map((label) => (
                    <button
                      key={label}
                      onClick={() => updateAssetLabel(asset.id, label)}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        asset.label === label
                          ? getLabelColor(label)
                          : 'bg-bt-gray-200 hover:bg-bt-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Info */}
                <p className="text-xs text-bt-gray-500 truncate">
                  {asset.prompt || asset.actor || 'Generated asset'}
                </p>
                <p className="text-xs text-bt-gray-400 mt-1">
                  {asset.createdAt.toLocaleDateString('nl-NL', { 
                    day: 'numeric', 
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-16 text-center">
          <ImageIcon className="w-16 h-16 text-bt-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-bt-dark-800 mb-2">
            Geen assets gevonden
          </h3>
          <p className="text-bt-gray-500">
            {assets.length === 0 
              ? 'Genereer eerst afbeeldingen in de andere tabs om ze hier te zien.'
              : 'Pas je filters aan om assets te vinden.'}
          </p>
        </div>
      )}
    </div>
  )
}
